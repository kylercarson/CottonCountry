# Cotton Country Transport

A responsive, static HTML/CSS/JavaScript website for Shaun Stabeno's transportation business in Lubbock and surrounding areas. No build tools or installation needed.

## Open it locally
Open `index.html` in your browser. To test with a local server, run `python3 -m http.server 8000` from this folder, then visit http://localhost:8000.

## Before publishing
1. Confirm the phone, email, business name, services, coverage radius, and wording with Shaun. Contact details and services came from your supplied flyer. No unverified licenses, insurance claims, hours, testimonials, or rates have been added.
2. Enable the contact form as explained below.
3. Replace the demo illustration and logo with final brand assets if desired. The supplied flyer is included as `assets/images/brand-flyer.png`.
4. Review `privacy.html` with Shaun and adapt it to his actual handling and retention of inquiries.
5. Send a real test inquiry after configuration and verify Shaun receives it.

## Contact form: same service as Birdies
I inspected BirdiesPlacement/main/index.html: it uses Formspree with a standard HTML POST form at `https://formspree.io/f/xqeynyqb`. This site uses Formspree too, with inline success/error messages and a plain POST fallback when configured. The Birdies endpoint is deliberately not reused, so Cotton Country inquiries do not go to Birdies.

1. Sign in to the Formspree account you use for Birdies (or create Shaun's account).
2. Create **two separate forms**, one for ride requests and one for general contact, for Cotton Country Transport and set Shaun's recipient email. Complete any recipient verification Formspree requires.
3. Copy each form's endpoint (like `https://formspree.io/f/abcdefgh`).
4. Open `assets/js/config.js` and paste them into `rideFormEndpoint` and `contactFormEndpoint`, respectively.
5. For submissions with JavaScript disabled, also set the HTML `action` attributes on `ride-form` and `contact-form` in `index.html` to their corresponding endpoints. Until configured, the site does not send inquiries and shows a call/email fallback.
6. Check spam settings and allowed domains in your Formspree account as appropriate. No API secret is needed in the website.

GitHub Pages serves static files and cannot receive or email form submissions itself. Formspree handles those submissions. Requests are not confirmed bookings. Do not ask visitors to submit medical records or other sensitive health information.

## Image directory
All image assets are under `assets/images/`. Paths are relative, so the site works under a GitHub repository URL without changing asset paths.

| File | Use | Replace with |
|---|---|---|
| `logo.svg` | Header, footer, favicon | Official logo; change the image `src` if using PNG/WebP |
| `cotton-field-sunset.png` | Stationary hero landscape | Background image |
| `brochure-van.png` | Scroll-animated van layer | Transparent vehicle image |
| `van-demo.svg` | Original combined demo illustration | Reference asset |
| `brand-flyer.png` | About section | Keep the supplied flyer or use a team/vehicle photo |

The hero uses two images: `cotton-field-sunset.png` stays still while `brochure-van.png` drives to the right as you scroll down and returns as you scroll up. The brochure van is a transparent cutout placed over the road independently of the landscape. For real photos, use a background photo plus a transparent vehicle PNG/WebP in the same canvas dimensions, updating the two image paths and the scene's accessible label in `index.html`. For a single vehicle photo, replace the whole `.hero-scene` contents with one image, remove the `hero-vehicle` class, and remove the demo caption. The JavaScript safely skips the van animation when its layer is absent.

## Scroll animations
Sections and cards slide into view once as they enter the screen, with a short stagger for cards. The hero van moves independently of its background. Animations use IntersectionObserver and requestAnimationFrame without external libraries. Visitors who request reduced motion see all content without animation. Content remains visible when JavaScript or IntersectionObserver is unavailable. Animation settings are at the end of `assets/css/styles.css` and `assets/js/main.js`.


## Publish on GitHub Pages
1. Create a GitHub repository (for example `cotton-country-transportation`).
2. Upload the **contents** of this folder, keeping `index.html` at the repository root alongside `privacy.html`, `.nojekyll`, and `assets/`.
3. In the repository, open **Settings → Pages**. Select **Deploy from a branch**, the `main` branch, and **/ (root)**; save.
4. Your repository site will be at `https://kylercarson.github.io/cotton-country-transportation/` if that is the repository name.
5. If using a custom domain, enter your actual domain in Pages settings and configure its DNS. No CNAME is included because the domain has not been confirmed.

## Files and editing
- `index.html`: All main sections and ride-request and general contact forms.
- `privacy.html`: Privacy notice.
- `assets/css/styles.css`: Colors, layout, and mobile styles. Brand colors are CSS variables at the top.
- `assets/js/config.js`: Two form endpoints, phone, email. For no-JavaScript visitors, also update corresponding contact links in HTML and the privacy page.
- `assets/js/main.js`: Mobile menu, service selection, current year, and form submission.
- `assets/images/`: Every embedded image.

The main site is a complete single-page website with direct links to Services, Our Story, Service Area, FAQs, and Contact. Privacy has its own page. It uses system fonts and local images, with no analytics, third-party UI libraries, or font downloads.

## SEO and mobile update
- Six distinct service pages, linked from homepage cards and all footers.
- Facility/coordinator information, Terms, and Privacy pages.
- Unique page titles/descriptions, self-canonical links, Open Graph/social tags, and business/service JSON-LD.
- `sitemap.xml`, crawl-friendly `robots.txt`, and a friendly `404.html` with `noindex`.
- Existing SVG favicon retained. Social cards use the existing flyer; replace its social image with a dedicated 1200×630 image later if desired.
- Mobile menus on every page, larger tap targets, responsive service pages, and 16px form text to avoid small-input zoom on phones.
- Existing scroll reveals and the animated van remain on the homepage.

### Confirm the live domain
SEO URLs currently use **https://cottoncountrytransport.com/**. This does not register or connect the domain. Before publishing at a DIFFERENT domain or a GitHub repository URL, run:

```bash
python3 scripts/set_site_url.py https://kylercarson.github.io/YOUR-REPOSITORY/
```

Or, for your intended custom domain:

```bash
python3 scripts/set_site_url.py https://cottoncountrytransport.com/
```

In GitHub Pages settings, configure the actual custom domain and HTTPS. No HTTP redirects can be configured by this static package; check HTTPS and www redirects after deployment. GitHub Pages uses `404.html` at missing URLs. The 404 page targets the configured live domain so nested invalid paths still have working assets/home links. A robots.txt must be at the DOMAIN root to govern crawling; for a GitHub project URL its repository copy may not control the host-wide crawler rules. Submit the sitemap URL directly in Search Console in that case.

### Analytics and phone-click tracking
Analytics are optional and disabled by default. To enable:
1. Create a Google Analytics 4 web property for the actual live site.
2. Paste its `G-...` Measurement ID into `gaMeasurementId` in `assets/js/config.js`.
3. Visitors then see an analytics choice; Google Analytics only loads after Allow. Preferences can be reopened from the footer. No thank-you/booking feature depends on this choice.
4. In the GA4 stream settings, disable enhanced measurement options you do not need, especially automatic form interactions. This package sends only page views, `phone_click`, and `generate_lead` (after successful Formspree responses), with fixed `form_type` labels. Do not add user/form contents to events.
5. Verify the events in GA4 Realtime. If you want to treat them as key events, configure that in GA4. A phone click means someone tapped a call link, not that a call connected or a ride was booked.

The code strips query strings/fragments from page locations sent to GA4 and does not send form contents or phone-link numbers as event parameters. Full traffic-source attribution is intentionally limited by suppressing referrers. Visitors, blockers, and consent choices can make analytics counts incomplete. Declining after previously allowing disables future analytics but does not remove previously recorded data or existing browser cookies.

### Still needs real-world setup
- Configure both Formspree endpoints and test actual delivery.
- Confirm domain ownership/DNS/HTTPS; add the site to Search Console and submit `sitemap.xml`.
- Confirm all business facts and review Terms/Privacy against Shaun's actual practices.
- Actual testimonials, credentials, owner photos, business-profile URLs, hours, rates, and response times must come from Shaun. No invented facts were added.
- LocalBusiness schema intentionally omits unknown street address and hours. It is useful descriptive markup but does not meet all Google LocalBusiness rich-result requirements without a confirmed physical address.
- Service content is specific and practical, without unverified prices, medical instructions, benefits coverage, or repetitive town pages. Expand with actual operating details when available.
- Image compression/replacement and a dedicated Apple touch icon/social image were not performed in this update.
- Run PageSpeed Insights, schema/social-preview checks, phone tests, and HTTPS redirect checks against the deployed site. Search visibility is not guaranteed.

The current hero uses an AI-edited transparent cutout based on the brochure van (`brochure-van.png`) and a photorealistic generated cotton-field sunset background (`cotton-field-sunset.png`). Windmill and irrigation pivot remain in the background. The van stays an independent animated layer.

## Clean page URLs
Secondary pages now live at `PAGE-NAME/index.html`, so public URLs end in `/` instead of `.html`. Upload each new folder alongside the homepage and assets. The old root `.html` files are small redirect pages; replace those files too to preserve existing links. GitHub Pages serves these as browser redirects, not HTTP 301 redirects.

All URLs currently target https://kylercarson.github.io/CottonCountry/. When connecting your final domain, run `python3 scripts/set_site_url.py https://cottoncountrytransport.com/` and commit the changes. The script updates nested pages as well. Existing form endpoints and contact settings were preserved from your uploaded code.
