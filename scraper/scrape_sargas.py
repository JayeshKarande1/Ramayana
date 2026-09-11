"""scraper/scrape_sargas.py - High performance concurrent scraper for all 648 Sargas and 23,402 Shlokas"""
import sys
import os
import re
import json
import time
import html as html_lib
from concurrent.futures import ThreadPoolExecutor, as_completed
import httpx

sys.stdout.reconfigure(encoding='utf-8')

KANDA_CONFIG = [
    {"id": "bala", "name": "Bala Kanda", "sargas": 77},
    {"id": "ayodhya", "name": "Ayodhya Kanda", "sargas": 119},
    {"id": "aranya", "name": "Aranya Kanda", "sargas": 75},
    {"id": "kishkindha", "name": "Kishkindha Kanda", "sargas": 67},
    {"id": "sundara", "name": "Sundara Kanda", "sargas": 68},
    {"id": "yuddha", "name": "Yuddha Kanda", "sargas": 131},
    {"id": "uttara", "name": "Uttara Kanda", "sargas": 111}
]

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sargas")

def parse_sarga_html(html_text, kanda_id, kanda_name, sarga_num):
    # Match all article blocks
    articles = re.findall(r'<article[^>]*id="shloka-(\d+)"[^>]*>(.*?)</article>', html_text, re.DOTALL)
    
    # Also extract sarga description/intro if available
    summary_match = re.search(r'<p class="text-sm text-muted-foreground[^>]*>(.*?)</p>', html_text)
    
    shlokas = []
    for num_str, art in articles:
        num = int(num_str)
        
        # ID (e.g. BK-1-1)
        code_m = re.search(r'font-mono[^>]*>([^<]+)</span>', art)
        code = code_m.group(1).strip() if code_m else f"{kanda_id[:2].upper()}-{sarga_num}-{num}"
        
        # Sanskrit Devanagari
        deva_m = re.search(r'<p[^>]*lang="sa-Deva">(.*?)</p>', art, re.DOTALL)
        deva = ""
        if deva_m:
            raw_deva = re.sub(r'<[^>]+>', '', deva_m.group(1))
            deva = html_lib.unescape(' '.join(raw_deva.split()))
            
        # Transliteration (italic text)
        trans_m = re.search(r'class="text-sm italic[^>]*>([^<]+)</p>', art)
        trans = html_lib.unescape(trans_m.group(1).strip()) if trans_m else ""
        
        # Word-by-word Translation
        wbw_m = re.search(r'>Translation</p>\s*<p[^>]*>(.*?)</p>', art, re.DOTALL)
        wbw = ""
        if wbw_m:
            raw_wbw = re.sub(r'<[^>]+>', '', wbw_m.group(1))
            wbw = html_lib.unescape(' '.join(raw_wbw.split()))
            
        # Prose Meaning
        mean_m = re.search(r'>Meaning</p>\s*<p[^>]*>(.*?)</p>', art, re.DOTALL)
        mean = ""
        if mean_m:
            raw_mean = re.sub(r'<[^>]+>', '', mean_m.group(1))
            mean = html_lib.unescape(' '.join(raw_mean.split()))

        shlokas.append({
            "id": code,
            "shlokaNumber": num,
            "sanskrit": deva,
            "transliteration": trans,
            "wordByWord": wbw,
            "meaning": mean
        })
        
    return {
        "kanda": kanda_id,
        "kandaName": kanda_name,
        "sarga": sarga_num,
        "title": f"Sarga {sarga_num}",
        "totalShlokas": len(shlokas),
        "shlokas": shlokas
    }

def scrape_single_sarga(client, kanda_id, kanda_name, sarga_num, retries=3):
    file_path = os.path.join(DATA_DIR, f"{kanda_id}_{sarga_num}.json")
    
    # Skip if valid file exists
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
                if existing.get("totalShlokas", 0) > 0:
                    return {"kanda": kanda_id, "sarga": sarga_num, "shlokas": existing["totalShlokas"], "status": "cached"}
        except Exception:
            pass
            
    url = f"https://ramayana.info/story/{kanda_id}/{sarga_num}/"
    
    for attempt in range(1, retries + 1):
        try:
            resp = client.get(url, timeout=25.0)
            if resp.status_code == 200:
                data = parse_sarga_html(resp.text, kanda_id, kanda_name, sarga_num)
                if data["totalShlokas"] > 0:
                    with open(file_path, "w", encoding="utf-8") as out:
                        json.dump(data, out, ensure_ascii=False, indent=2)
                    return {"kanda": kanda_id, "sarga": sarga_num, "shlokas": data["totalShlokas"], "status": "scraped"}
                else:
                    # Page may not have shlokas or format differed
                    return {"kanda": kanda_id, "sarga": sarga_num, "shlokas": 0, "status": "empty"}
            elif resp.status_code == 404:
                return {"kanda": kanda_id, "sarga": sarga_num, "shlokas": 0, "status": "404"}
        except Exception as e:
            if attempt == retries:
                return {"kanda": kanda_id, "sarga": sarga_num, "error": str(e), "status": "error"}
            time.sleep(1.0 * attempt)
            
    return {"kanda": kanda_id, "sarga": sarga_num, "status": "failed"}

def scrape_all_sargas(max_workers=6):
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Build list of all (kanda_id, kanda_name, sarga_num)
    tasks = []
    for k in KANDA_CONFIG:
        for s in range(1, k["sargas"] + 1):
            tasks.append((k["id"], k["name"], s))
            
    total_tasks = len(tasks)
    print(f"Starting sarga extraction: {total_tasks} sargas across 7 kandas using {max_workers} threads...")
    
    start_time = time.time()
    completed = 0
    scraped_count = 0
    cached_count = 0
    total_shlokas_accum = 0
    errors = []

    # Shared HTTP client with connection pooling
    limits = httpx.Limits(max_keepalive_connections=max_workers, max_connections=max_workers * 2)
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    
    with httpx.Client(headers=headers, limits=limits) as client:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_task = {
                executor.submit(scrape_single_sarga, client, k_id, k_name, s_num): (k_id, s_num)
                for k_id, k_name, s_num in tasks
            }
            
            for future in as_completed(future_to_task):
                completed += 1
                res = future.result()
                status = res.get("status")
                shloka_cnt = res.get("shlokas", 0)
                total_shlokas_accum += shloka_cnt
                
                if status == "scraped":
                    scraped_count += 1
                elif status == "cached":
                    cached_count += 1
                elif status in ("error", "failed"):
                    errors.append(res)
                    
                if completed % 25 == 0 or completed == total_tasks:
                    elapsed = time.time() - start_time
                    rate = completed / elapsed if elapsed > 0 else 0
                    percent = (completed / total_tasks) * 100
                    print(f"[{completed}/{total_tasks}] ({percent:.1f}%) - Scraped: {scraped_count}, Cached: {cached_count}, Shlokas so far: {total_shlokas_accum} ({rate:.1f} sargas/sec)")

    elapsed = time.time() - start_time
    print("\n" + "="*60)
    print(f"Extraction completed in {elapsed:.1f} seconds!")
    print(f"Total Sargas Processed: {completed}")
    print(f"Newly Scraped: {scraped_count}, Cached: {cached_count}")
    print(f"Total Shlokas Collected: {total_shlokas_accum}")
    if errors:
        print(f"Errors ({len(errors)}): {errors[:5]}")
    print("="*60)

if __name__ == "__main__":
    scrape_all_sargas(max_workers=6)
