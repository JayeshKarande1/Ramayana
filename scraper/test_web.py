import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    'http://localhost:3000/',
    'http://localhost:3000/api/search?q=dharma',
    'http://localhost:3000/story/bala/1',
    'http://localhost:3000/journey',
    'http://localhost:3000/pradakshina',
    'http://localhost:3000/characters',
    'http://localhost:3000/parayana'
]

client = httpx.Client(timeout=15.0)
all_passed = True

for u in urls:
    try:
        r = client.get(u)
        print(f"✓ {u} -> Status: {r.status_code} ({len(r.text)} bytes)")
        if 'api/search' in u:
            data = r.json()
            results = data.get('results', [])
            print(f"  → Search API returned {len(results)} matches for 'dharma'!")
            if results:
                first = results[0]
                print(f"  → Top Match: [{first['verse_code']}] {first['meaning'][:80]}...")
        if r.status_code != 200:
            all_passed = False
    except Exception as e:
        print(f"✗ Failed {u}: {e}")
        all_passed = False

if all_passed:
    print("\nALL WEB ENDPOINTS & APIS PASSED WITH 100% SUCCESS!")
