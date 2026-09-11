"""scraper/scrape_characters.py - Extracts all 194 characters with tiers, tags, and profiles"""
import sys
import re
import json
import time
import httpx
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

def scrape_characters():
    print("Scraping Ramayana Personalities (194 figures)...")
    url = "https://ramayana.info/characters/"
    client = httpx.Client(headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, timeout=25.0)
    
    resp = client.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    
    # Each tier section has an id like tier-0, tier-1, etc.
    tier_sections = soup.find_all("section", id=re.compile(r"tier-\d+"))
    print(f"Found {len(tier_sections)} tier sections.")
    
    characters = []
    
    for section in tier_sections:
        # Tier title & sanskrit
        h2 = section.find("h2")
        tier_title = h2.get_text(strip=True) if h2 else "General"
        sa_span = section.find("span", class_=re.compile(r"text-sanskrit"))
        tier_sa = sa_span.get_text(strip=True) if sa_span else ""
        tier_icon_span = section.find("span", class_=re.compile(r"text-3xl"))
        tier_icon = tier_icon_span.get_text(strip=True) if tier_icon_span else "🕉️"
        
        cards = section.find_all("div", attrs={"data-slot": "card"})
        for card in cards:
            # Check if card is wrapped in link
            parent_a = card.find_parent("a")
            profile_url = parent_a["href"] if parent_a and parent_a.has_attr("href") else None
            slug = profile_url.strip("/").split("/")[-1] if profile_url else None
            
            # Title
            title_elem = card.find(attrs={"data-slot": "card-title"})
            name = title_elem.get_text(strip=True).replace("→", "").strip() if title_elem else ""
            
            # Sanskrit name
            sa_elem = card.find("p", class_=re.compile(r"text-sanskrit"))
            sanskrit_name = sa_elem.get_text(strip=True) if sa_elem else ""
            
            # Role tag (e.g. deity, human, etc.)
            role_badge = card.find(attrs={"data-slot": "badge"})
            role_tag = role_badge.get_text(strip=True) if role_badge else "character"
            
            # Description
            desc_elem = card.find(attrs={"data-slot": "card-description"})
            description = desc_elem.get_text(strip=True) if desc_elem else ""
            
            # Also known as
            aliases = []
            aka_p = card.find(string=re.compile(r"Also known as"))
            if aka_p:
                aka_container = aka_p.parent
                aka_text = aka_container.get_text(strip=True).replace("Also known as:", "").strip()
                aliases = [a.strip() for a in aka_text.split(",") if a.strip()]
                
            # Appears in
            appears_in = []
            app_p = card.find(string=re.compile(r"Appears in"))
            if app_p:
                app_container = app_p.parent
                app_text = app_container.get_text(strip=True).replace("Appears in:", "").strip()
                appears_in = [a.strip() for a in app_text.split(",") if a.strip()]
                
            # Fallback slug if no profile link
            if not slug:
                slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

            characters.append({
                "slug": slug,
                "name": name,
                "sanskritName": sanskrit_name,
                "tier": {
                    "title": tier_title,
                    "sanskrit": tier_sa,
                    "icon": tier_icon
                },
                "roleTag": role_tag,
                "description": description,
                "aliases": aliases,
                "appearsIn": appears_in,
                "hasFullProfile": bool(profile_url),
                "profileUrl": profile_url
            })

    print(f"Total personalities parsed: {len(characters)}")
    
    # Now enrich full profiles for key figures
    profile_chars = [c for c in characters if c["hasFullProfile"]]
    print(f"Found {len(profile_chars)} characters with dedicated profile pages. Enriching...")
    
    for c in profile_chars:
        try:
            full_url = "https://ramayana.info" + c["profileUrl"]
            p_resp = client.get(full_url)
            if p_resp.status_code == 200:
                p_soup = BeautifulSoup(p_resp.text, "html.parser")
                # Extract main article prose
                prose_div = p_soup.find("div", class_=re.compile(r"prose"))
                if prose_div:
                    paragraphs = [p.get_text(strip=True) for p in prose_div.find_all("p")]
                    c["extendedBio"] = "\n\n".join(paragraphs)
                
                # Extract any key attributes or relationships if present
                meta_blocks = p_soup.find_all("div", class_=re.compile(r"rounded-xl border"))
                c["profileDetails"] = len(meta_blocks)
                print(f"  Enriched profile for: {c['name']}")
            time.sleep(0.2)
        except Exception as e:
            print(f"  Failed enriching {c['name']}: {e}")

    with open("data/characters.json", "w", encoding="utf-8") as f:
        json.dump(characters, f, ensure_ascii=False, indent=2)
    print("Saved data/characters.json")

if __name__ == "__main__":
    scrape_characters()
