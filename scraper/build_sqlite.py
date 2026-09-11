"""scraper/build_sqlite.py - Aggregates all JSON data into SQLite database with FTS5 search"""
import sys
import os
import glob
import json
import sqlite3

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "ramayana.db")

def build_database():
    print(f"Building SQLite database at: {DB_PATH}")
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception:
            pass
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Kandas table
    cursor.execute("""
    CREATE TABLE kandas (
        id TEXT PRIMARY KEY,
        order_num INTEGER,
        roman_numeral TEXT,
        name TEXT,
        sanskrit TEXT,
        subtitle TEXT,
        description TEXT,
        sargas_count INTEGER,
        shlokas_count INTEGER,
        theme_color TEXT
    )
    """)
    
    # 2. Sargas table
    cursor.execute("""
    CREATE TABLE sargas (
        id TEXT PRIMARY KEY,
        kanda_id TEXT,
        sarga_number INTEGER,
        title TEXT,
        total_shlokas INTEGER,
        FOREIGN KEY(kanda_id) REFERENCES kandas(id)
    )
    """)
    
    # 3. Shlokas table with canonical_id as PRIMARY KEY
    cursor.execute("""
    CREATE TABLE shlokas (
        id TEXT PRIMARY KEY,
        verse_code TEXT,
        kanda_id TEXT,
        sarga_number INTEGER,
        shloka_number INTEGER,
        sanskrit TEXT,
        transliteration TEXT,
        word_by_word TEXT,
        meaning TEXT,
        FOREIGN KEY(kanda_id) REFERENCES kandas(id)
    )
    """)
    
    # 4. FTS5 Virtual Table for Instant Search
    cursor.execute("""
    CREATE VIRTUAL TABLE shlokas_fts USING fts5(
        shloka_id,
        verse_code,
        kanda_id,
        sarga_number UNINDEXED,
        shloka_number UNINDEXED,
        sanskrit,
        transliteration,
        word_by_word,
        meaning
    )
    """)
    
    # 5. Characters table
    cursor.execute("""
    CREATE TABLE characters (
        slug TEXT PRIMARY KEY,
        name TEXT,
        sanskrit_name TEXT,
        tier_title TEXT,
        tier_sanskrit TEXT,
        tier_icon TEXT,
        role_tag TEXT,
        description TEXT,
        aliases TEXT,
        appears_in TEXT,
        extended_bio TEXT,
        has_full_profile INTEGER
    )
    """)
    
    # 6. Journey Stops table
    cursor.execute("""
    CREATE TABLE journey_stops (
        stop_number INTEGER PRIMARY KEY,
        name TEXT,
        sanskrit_name TEXT,
        kanda TEXT,
        location TEXT,
        latitude REAL,
        longitude REAL,
        description TEXT,
        tags TEXT,
        featured_shloka_sanskrit TEXT,
        featured_shloka_meaning TEXT,
        maps_url TEXT
    )
    """)
    
    # 7. Pradakshina (108 Names) table
    cursor.execute("""
    CREATE TABLE pradakshina_names (
        id INTEGER PRIMARY KEY,
        name TEXT,
        iast TEXT,
        meaning TEXT
    )
    """)

    # Populate Kandas
    kandas_path = os.path.join(DATA_DIR, "kandas.json")
    if os.path.exists(kandas_path):
        with open(kandas_path, "r", encoding="utf-8") as f:
            kandas_data = json.load(f)
            for k in kandas_data:
                cursor.execute("""
                INSERT INTO kandas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    k["id"], k["order"], k["romanNumeral"], k["name"], k["sanskrit"],
                    k["subtitle"], k["description"], k["sargasCount"], k["shlokasCount"],
                    k["themeColor"]
                ))
        print(f"Inserted {len(kandas_data)} kandas.")

    # Populate Pradakshina
    pradakshina_path = os.path.join(DATA_DIR, "pradakshina.json")
    if os.path.exists(pradakshina_path):
        with open(pradakshina_path, "r", encoding="utf-8") as f:
            names_data = json.load(f)
            for n in names_data:
                cursor.execute("""
                INSERT INTO pradakshina_names VALUES (?, ?, ?, ?)
                """, (n["id"], n["name"], n["iast"], n["meaning"]))
        print(f"Inserted {len(names_data)} sacred names.")

    # Populate Journey
    journey_path = os.path.join(DATA_DIR, "journey.json")
    if os.path.exists(journey_path):
        with open(journey_path, "r", encoding="utf-8") as f:
            journey_data = json.load(f)
            for j in journey_data:
                cursor.execute("""
                INSERT INTO journey_stops VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    j["stop"], j["name"], j["sanskritName"], j["kanda"], j["location"],
                    j["coordinates"]["latitude"], j["coordinates"]["longitude"],
                    j["description"], json.dumps(j["tags"], ensure_ascii=False),
                    j["featuredShloka"].get("sanskrit", ""), j["featuredShloka"].get("meaning", ""),
                    j.get("mapsUrl", "")
                ))
        print(f"Inserted {len(journey_data)} journey stops.")

    # Populate Characters
    chars_path = os.path.join(DATA_DIR, "characters.json")
    if os.path.exists(chars_path):
        with open(chars_path, "r", encoding="utf-8") as f:
            chars_data = json.load(f)
            for c in chars_data:
                cursor.execute("""
                INSERT INTO characters VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    c["slug"], c["name"], c["sanskritName"],
                    c["tier"]["title"], c["tier"]["sanskrit"], c["tier"]["icon"],
                    c["roleTag"], c["description"],
                    json.dumps(c["aliases"], ensure_ascii=False),
                    json.dumps(c["appearsIn"], ensure_ascii=False),
                    c.get("extendedBio", ""),
                    1 if c.get("hasFullProfile") else 0
                ))
        print(f"Inserted {len(chars_data)} characters.")

    # Populate Sargas & Shlokas from data/sargas/*.json
    sarga_files = glob.glob(os.path.join(DATA_DIR, "sargas", "*.json"))
    print(f"Processing {len(sarga_files)} sarga files...")
    
    total_shlokas = 0
    shlokas_batch = []
    fts_batch = []
    
    for s_file in sarga_files:
        with open(s_file, "r", encoding="utf-8") as f:
            s_data = json.load(f)
            
        k_id = s_data["kanda"]
        s_num = s_data["sarga"]
        s_pk = f"{k_id}_{s_num}"
        
        cursor.execute("""
        INSERT INTO sargas VALUES (?, ?, ?, ?, ?)
        """, (s_pk, k_id, s_num, s_data["title"], s_data["totalShlokas"]))
        
        for idx, sh in enumerate(s_data.get("shlokas", []), 1):
            sh_num = sh.get("shlokaNumber", idx)
            canonical_id = f"{k_id}_{s_num}_{sh_num}"
            verse_code = sh.get("id", canonical_id)
            sanskrit = sh.get("sanskrit", "")
            translit = sh.get("transliteration", "")
            wbw = sh.get("wordByWord", "")
            meaning = sh.get("meaning", "")
            
            shlokas_batch.append((canonical_id, verse_code, k_id, s_num, sh_num, sanskrit, translit, wbw, meaning))
            fts_batch.append((canonical_id, verse_code, k_id, s_num, sh_num, sanskrit, translit, wbw, meaning))
            total_shlokas += 1
            
            if len(shlokas_batch) >= 1000:
                cursor.executemany("INSERT OR REPLACE INTO shlokas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", shlokas_batch)
                cursor.executemany("INSERT INTO shlokas_fts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", fts_batch)
                shlokas_batch.clear()
                fts_batch.clear()

    if shlokas_batch:
        cursor.executemany("INSERT OR REPLACE INTO shlokas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", shlokas_batch)
        cursor.executemany("INSERT INTO shlokas_fts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", fts_batch)
        shlokas_batch.clear()
        fts_batch.clear()

    # Create indices for sub-millisecond lookups
    cursor.execute("CREATE INDEX idx_shlokas_kanda_sarga ON shlokas(kanda_id, sarga_number)")
    cursor.execute("CREATE INDEX idx_shlokas_kanda ON shlokas(kanda_id)")
    
    conn.commit()
    conn.close()
    
    print("\n" + "="*60)
    print(f"Database successfully generated! ({DB_PATH})")
    print(f"Total Shlokas stored & indexed: {total_shlokas}")
    print("="*60)

if __name__ == "__main__":
    build_database()
