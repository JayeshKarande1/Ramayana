import sqlite3
import json
import os

def generate_index():
    db_path = 'data/ramayana.db'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # Get first shloka of every sarga (guarantees coverage of all 648 sargas)
    c.execute("""
        SELECT verse_code, kanda_id, sarga_number, shloka_number, sanskrit, transliteration, meaning 
        FROM shlokas 
        WHERE shloka_number = 1
    """)
    first_shlokas = c.fetchall()

    # Get shlokas with substantive meanings, prioritize shorter/punchy ones
    c.execute("""
        SELECT verse_code, kanda_id, sarga_number, shloka_number, sanskrit, transliteration, meaning 
        FROM shlokas 
        WHERE shloka_number > 1 AND meaning != '' AND length(meaning) > 20
        LIMIT 4500
    """)
    other_shlokas = c.fetchall()

    all_shlokas = first_shlokas + other_shlokas

    data = []
    seen = set()
    for r in all_shlokas:
        code = r[0]
        if code in seen:
            continue
        seen.add(code)
        data.append({
            'shloka_id': f"{r[1]}_{r[2]}_{r[3]}",
            'verse_code': code,
            'kanda_id': r[1],
            'sarga_number': r[2],
            'shloka_number': r[3],
            'sanskrit': r[4][:120],
            'transliteration': (r[5] or '')[:120],
            'meaning': r[6][:220]
        })

    out_dir = os.path.join('web', 'public')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'search_index.json')

    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

    size_kb = os.path.getsize(out_file) / 1024
    print(f"Generated search index with {len(data)} entries ({size_kb:.1f} KB) at {out_file}")

if __name__ == '__main__':
    generate_index()
