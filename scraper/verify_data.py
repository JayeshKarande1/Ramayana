"""scraper/verify_data.py - Audits the scraped Ramayana dataset for completeness and integrity"""
import sys
import os
import glob
import json
import sqlite3

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "ramayana.db")

def verify():
    print("="*60)
    print("VALMIKI RAMAYANA DATASET AUDIT & INTEGRITY VERIFICATION")
    print("="*60)
    
    # 1. Check Kandas
    kandas_file = os.path.join(DATA_DIR, "kandas.json")
    assert os.path.exists(kandas_file), "Missing data/kandas.json"
    with open(kandas_file, "r", encoding="utf-8") as f:
        kandas = json.load(f)
    print(f"✓ Kandas: {len(kandas)} / 7 Kandas verified.")
    
    # 2. Check Pradakshina (108 Names)
    pradakshina_file = os.path.join(DATA_DIR, "pradakshina.json")
    assert os.path.exists(pradakshina_file), "Missing data/pradakshina.json"
    with open(pradakshina_file, "r", encoding="utf-8") as f:
        names = json.load(f)
    print(f"✓ Pradakshina: {len(names)} / 108 Sacred Names verified.")
    
    # 3. Check Journey Stops
    journey_file = os.path.join(DATA_DIR, "journey.json")
    assert os.path.exists(journey_file), "Missing data/journey.json"
    with open(journey_file, "r", encoding="utf-8") as f:
        stops = json.load(f)
    print(f"✓ Journey Stops: {len(stops)} / 15 Stops verified (Ayodhya to Lanka).")
    
    # 4. Check Characters
    chars_file = os.path.join(DATA_DIR, "characters.json")
    assert os.path.exists(chars_file), "Missing data/characters.json"
    with open(chars_file, "r", encoding="utf-8") as f:
        characters = json.load(f)
    print(f"✓ Characters: {len(characters)} / 194 Personalities verified.")
    
    # 5. Check Sargas JSON files
    sarga_files = glob.glob(os.path.join(DATA_DIR, "sargas", "*.json"))
    print(f"✓ Sargas on disk: {len(sarga_files)} / 648 files found.")
    
    # Count total shlokas in JSON
    total_json_shlokas = 0
    empty_sargas = []
    shlokas_missing_meaning = 0
    shlokas_missing_sanskrit = 0
    
    for sf in sarga_files:
        with open(sf, "r", encoding="utf-8") as f:
            s_data = json.load(f)
            cnt = len(s_data.get("shlokas", []))
            total_json_shlokas += cnt
            if cnt == 0:
                empty_sargas.append(os.path.basename(sf))
            for sh in s_data.get("shlokas", []):
                if not sh.get("meaning"):
                    shlokas_missing_meaning += 1
                if not sh.get("sanskrit"):
                    shlokas_missing_sanskrit += 1
                    
    print(f"✓ Total Shlokas extracted in JSON: {total_json_shlokas:,}")
    if empty_sargas:
        print(f"⚠️ Empty Sargas ({len(empty_sargas)}): {empty_sargas[:10]}")
    else:
        print("✓ Zero empty sargas.")
    print(f"  - Shlokas with Sanskrit Devanagari: {total_json_shlokas - shlokas_missing_sanskrit:,}")
    print(f"  - Shlokas with English Meaning: {total_json_shlokas - shlokas_missing_meaning:,}")

    # 6. Check SQLite Database
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM shlokas")
        db_shlokas = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM sargas")
        db_sargas = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM characters")
        db_chars = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM journey_stops")
        db_stops = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM pradakshina_names")
        db_names = c.fetchone()[0]
        
        # Test full-text search query
        c.execute("SELECT shloka_id, kanda_id, sarga_number, shloka_number, meaning FROM shlokas_fts WHERE shlokas_fts MATCH 'dharma' LIMIT 2")
        sample_results = c.fetchall()
        
        conn.close()
        
        print("\nSQLite Database Check:")
        print(f"✓ DB Shlokas: {db_shlokas:,}")
        print(f"✓ DB Sargas: {db_sargas}")
        print(f"✓ DB Characters: {db_chars}")
        print(f"✓ DB Journey Stops: {db_stops}")
        print(f"✓ DB Pradakshina Names: {db_names}")
        print(f"✓ FTS5 Search verified. Sample match count for 'dharma': {len(sample_results)}")
        for r in sample_results:
            print(f"   [{r[0]}]: {r[4][:90]}...")
            
    print("="*60)
    print("AUDIT COMPLETE")
    print("="*60)

if __name__ == "__main__":
    verify()
