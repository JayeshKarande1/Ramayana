"""scraper/scrape_pradakshina.py - Extracts 108 names of Sri Rama"""
import sys
import re
import json
import httpx

sys.stdout.reconfigure(encoding='utf-8')

def scrape_pradakshina():
    print("Scraping 108 names of Sri Rama (Pradakshina)...")
    base_url = "https://ramayana.info/pradakshina/"
    client = httpx.Client(headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, timeout=20.0)
    
    resp = client.get(base_url)
    resp.raise_for_status()
    html = resp.text

    chunks = re.findall(r'<script src="(/_next/static/chunks/[^"]+)"', html)
    names = []
    
    for chunk_url in chunks:
        full_chunk_url = "https://ramayana.info" + chunk_url
        try:
            c_resp = client.get(full_chunk_url)
            if c_resp.status_code == 200 and "श्रीरामः" in c_resp.text:
                js_text = c_resp.text
                item_pattern = re.compile(r'\{deva:"([^"]+)",iast:"([^"]+)",meaning:"([^"]+)"\}')
                items = item_pattern.findall(js_text)
                for idx, (deva, iast, meaning) in enumerate(items, 1):
                    names.append({
                        "id": idx,
                        "name": deva,
                        "iast": iast,
                        "meaning": meaning
                    })
                if names:
                    break
        except Exception as e:
            print(f"Error checking {chunk_url}: {e}")
            
    print(f"Total names extracted: {len(names)}")
    if len(names) == 108:
        print("Verified exactly 108 names!")
    
    with open("data/pradakshina.json", "w", encoding="utf-8") as f:
        json.dump(names, f, ensure_ascii=False, indent=2)
    print("Saved data/pradakshina.json")

if __name__ == "__main__":
    scrape_pradakshina()
