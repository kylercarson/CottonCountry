"""Update absolute SEO URLs before deployment; preserves a GitHub repo subpath."""
from pathlib import Path
from urllib.parse import urlparse
import sys
root = Path(__file__).resolve().parents[1]
if len(sys.argv) != 2:
    raise SystemExit('Usage: python3 scripts/set_site_url.py https://your-domain.com/')
new = sys.argv[1].rstrip('/') + '/'
url = urlparse(new)
if url.scheme != 'https' or not url.netloc or url.query or url.fragment:
    raise SystemExit('Use a complete HTTPS site URL without query strings or fragments.')
marker = root / 'site-url.txt'
old = marker.read_text().strip()
for path in list(root.glob('*.html')) + [root / 'sitemap.xml', root / 'robots.txt']:
    path.write_text(path.read_text().replace(old, new))
marker.write_text(new + '\n')
print('Updated canonical, social, schema, sitemap, robots, and 404 URLs to', new)
