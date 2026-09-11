"""scraper/scrape_journey.py - Extracts all 15 sacred stops of Rama's 14-year Journey"""
import sys
import re
import json
import html as html_lib
import httpx
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

def scrape_journey():
    print("Scraping Rama's Journey Map (15 stops)...")
    url = "https://ramayana.info/journey/"
    client = httpx.Client(headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, timeout=20.0)
    
    resp = client.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    
    stops = []
    
    # Each stop is in a card container with Stop X of 15
    stop_badges = soup.find_all(string=re.compile(r"Stop\s+(\d+)\s+of\s+15"))
    print(f"Found {len(stop_badges)} stop badges in page.")
    
    for badge in stop_badges:
        match = re.search(r"Stop\s+(\d+)\s+of\s+15", badge)
        stop_num = int(match.group(1))
        
        # Traverse up to card container
        card = badge.find_parent(lambda tag: tag.name == "div" and tag.find("h3"))
        if not card:
            continue
            
        # Name
        h3 = card.find("h3")
        name = h3.get_text(strip=True) if h3 else ""
        
        # Sanskrit Name
        sa_p = card.find("p", class_=re.compile(r"text-sanskrit"))
        sanskrit_name = sa_p.get_text(strip=True) if sa_p else ""
        
        # Kanda badge
        kanda_badge = card.find(attrs={"data-slot": "badge"})
        kanda = kanda_badge.get_text(strip=True) if kanda_badge else ""
        
        # Location and coordinates: "📍 Ayodhya, Uttar Pradesh · 26.79°N, 82.2°E"
        loc_p = card.find(string=re.compile(r"📍"))
        location = ""
        latitude = None
        longitude = None
        if loc_p:
            loc_text = loc_p.parent.get_text(strip=True).replace("📍", "").strip()
            parts = [p.strip() for p in loc_text.split("·")]
            location = parts[0] if len(parts) > 0 else loc_text
            if len(parts) > 1:
                coords_str = parts[1]
                coords_match = re.search(r"([0-9.]+)\s*°\s*([NS])\s*,\s*([0-9.]+)\s*°\s*([EW])", coords_str)
                if coords_match:
                    lat_val, lat_dir, lng_val, lng_dir = coords_match.groups()
                    latitude = float(lat_val) if lat_dir == "N" else -float(lat_val)
                    longitude = float(lng_val) if lng_dir == "E" else -float(lng_val)
        
        # Description
        desc_p = card.find("p", class_=re.compile(r"text-foreground/80"))
        description = desc_p.get_text(strip=True) if desc_p else ""
        
        # Tags
        tag_spans = card.find_all("span", class_=re.compile(r"rounded-full"))
        tags = [t.get_text(strip=True) for t in tag_spans if "Kanda" not in t.get_text() and "Stop" not in t.get_text()]
        
        # Featured Shloka
        shloka_deva = ""
        shloka_meaning = ""
        featured_heading = card.find(string=re.compile(r"Featured Shloka"))
        if featured_heading:
            f_container = featured_heading.parent.parent
            deva_elem = f_container.find("p", class_=re.compile(r"text-base"))
            if deva_elem:
                shloka_deva = deva_elem.get_text(strip=True)
            meaning_elem = f_container.find("p", class_=re.compile(r"italic"))
            if meaning_elem:
                shloka_meaning = meaning_elem.get_text(strip=True).strip("“”\"")
                
        # Google Maps link
        maps_link = card.find("a", href=re.compile(r"google\.com/maps"))
        maps_url = maps_link["href"] if maps_link else None

        stops.append({
            "stop": stop_num,
            "name": name,
            "sanskritName": sanskrit_name,
            "kanda": kanda,
            "location": location,
            "coordinates": {
                "latitude": latitude,
                "longitude": longitude
            },
            "description": description,
            "tags": tags,
            "featuredShloka": {
                "sanskrit": shloka_deva,
                "meaning": shloka_meaning
            },
            "mapsUrl": maps_url
        })

    # Sort by stop number
    stops.sort(key=lambda s: s["stop"])
    print(f"Total stops extracted: {len(stops)}")
    
    with open("data/journey.json", "w", encoding="utf-8") as f:
        json.dump(stops, f, ensure_ascii=False, indent=2)
    print("Saved data/journey.json")

if __name__ == "__main__":
    scrape_journey()
