import httpx
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    'http://localhost:3000/',
    'http://localhost:3000/search_index.json',
    'http://localhost:3000/story',
    'http://localhost:3000/story/bala',
    'http://localhost:3000/story/bala/1',
    'http://localhost:3000/journey',
    'http://localhost:3000/pradakshina',
    'http://localhost:3000/characters',
    'http://localhost:3000/relics',
    'http://localhost:3000/compass',
    'http://localhost:3000/parayana'
]

client = httpx.Client(timeout=15.0, follow_redirects=True)
all_passed = True

for u in urls:
    try:
        r = client.get(u)
        print(f"✓ {u} -> Status: {r.status_code} ({len(r.text)} bytes)")
        if 'search_index.json' in u:
            data = r.json()
            print(f"  → Search Index loaded {len(data)} indexed verses!")
            matches = [item for item in data if 'dharma' in item.get('meaning', '').lower() or 'dharma' in item.get('transliteration', '').lower()]
            print(f"  → Client search test: found {len(matches)} matches for 'dharma'!")
            if matches:
                first = matches[0]
                print(f"  → Top Match: [{first['verse_code']}] {first['meaning'][:80]}...")
        if r.status_code != 200:
            all_passed = False
    except Exception as e:
        print(f"✗ Failed {u}: {e}")
        all_passed = False

if all_passed:
    print("\nALL WEB ENDPOINTS & SEARCH PASSED WITH 100% SUCCESS!")
