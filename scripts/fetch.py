"""Télécharge des photos de nourriture libres (Wikimedia Commons) pour les carrousels Budgemy."""
import json, re, os, io, time, html
import requests
from PIL import Image

API = "https://commons.wikimedia.org/w/api.php"
S = requests.Session()
S.headers["User-Agent"] = "BudgemyCarouselBot/1.0 (https://www.budgemy.com)"
OK = re.compile(r"^(CC0|Public domain|PD|CC BY(-SA)? \d(\.\d)?)", re.I)

queries = json.load(open("queries.json"))
os.makedirs("photos", exist_ok=True)
manifest = json.load(open("manifest.json")) if os.path.exists("manifest.json") else []
have = {m["source"] for m in manifest}

def clean(t):
    return html.unescape(re.sub(r"<[^>]+>", "", t or "")).strip()

def search(q, extra):
    r = S.get(API, params={"action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"{q} filetype:bitmap {extra}", "gsrnamespace": 6, "gsrlimit": 25,
        "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1600}, timeout=60)
    return sorted(r.json().get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))

for item in queries:
    slug, q, n = item["slug"], item["q"], item.get("n", 4)
    got = sum(1 for m in manifest if m["subject"] == slug)
    for extra in ['incategory:"Quality images"', ""]:
        if got >= n: break
        for p in search(q, extra):
            if got >= n: break
            ii = (p.get("imageinfo") or [{}])[0]
            md = ii.get("extmetadata", {})
            lic = clean(md.get("LicenseShortName", {}).get("value"))
            page = ii.get("descriptionurl")
            if not OK.match(lic) or page in have: continue
            if ii.get("width", 0) < 1400 or ii.get("height", 0) < 900: continue
            try:
                img = Image.open(io.BytesIO(S.get(ii["thumburl"], timeout=60).content)).convert("RGB")
            except Exception:
                continue
            got += 1
            fn = f"photos/{slug}-{got}.jpg"
            img.save(fn, "JPEG", quality=86)
            manifest.append({"file": fn, "subject": slug, "title": clean(p["title"]).removeprefix("File:"),
                "author": clean(md.get("Artist", {}).get("value"))[:80] or "inconnu", "license": lic,
                "source": page, "width": img.width, "height": img.height})
            have.add(page)
            time.sleep(0.5)

json.dump(manifest, open("manifest.json", "w"), ensure_ascii=False, indent=1)
print(len(manifest), "photos")
