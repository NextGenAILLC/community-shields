# Community Shields — static website

The public interest site for **Community Shields**, a civic-unity initiative (now forming in Wisconsin) that brings neighbors, local businesses, and fire, EMS and police communities together.

Live at **https://communityshields.com/**.

The site is plain HTML, CSS and JavaScript. There is no build step, no npm install, no database and no framework. It includes illustrative imagery, a favicon, light/dark mode, mobile navigation, an FAQ, and a community-interest form that submits to Formspree.

This is an interest site. It is not a database-backed community portal, an emergency-reporting service, or evidence of any agency partnership.

## Repository contents

| Path | Purpose |
| --- | --- |
| `index.html` | Page content, metadata (canonical URL, Open Graph, Twitter card, Organization JSON-LD) and the interest form |
| `styles.css` | Design, layout, typography and responsive breakpoints |
| `script.js` | Theme toggle, mobile menu, need chips, town autocomplete wiring, form validation and submission |
| `wi-places.js` | List of 659 Wisconsin place names used for the town/community autocomplete |
| `CommunityShields-Standalone.html` | Self-contained single-file copy of the site (styles, scripts, place list and images inlined) |
| `assets/*.webp` | Illustrative AI-generated concept imagery — not photographs of real Wisconsin places or partner departments |
| `favicon.svg` | Scalable shield icon |
| `robots.txt`, `sitemap.xml` | Search-engine crawl rules and sitemap for communityshields.com |
| `CNAME` | Custom domain (`communityshields.com`) for GitHub Pages |
| `vercel.json` | Optional config with clean URLs and protective headers, used only if the site is deployed to Vercel |
| `SECURITY.md` | How to report a vulnerability privately |

## Interest form

The form in `index.html` (and in the standalone file) posts to a live Formspree endpoint:

```html
<form id="interest-form" action="https://formspree.io/f/mppqygnw" method="POST" novalidate>
```

Submissions are delivered to the notification inbox configured in the Formspree account that owns this form. To change where submissions go, change the recipient in Formspree, or replace the form ID in **both** `index.html` and `CommunityShields-Standalone.html`.

### Fields sent

- Name, email address, town/community (with Wisconsin place autocomplete), and role
- Role options include neighbor/resident, local business owner, fire/EMS/police representative, search & rescue volunteer, county/tribal emergency management, municipal/county leader, school staff, nonprofit/civic organization, faith/community group, healthcare provider, veteran/military family, "just interested" and other
- Optional "What does your town need most?" message, with tappable example chips (for example, finding missing people faster, water & ice rescue, rural coverage, AEDs & medical kits, community alerts) that add text to the message
- Required permission-to-contact checkbox
- A fixed email subject (`_subject`) and a hidden honeypot field (`_gotcha`) for basic bot deterrence

### Behavior

- Required fields are validated in the browser before sending.
- The form submits with `fetch` and shows a success message only after Formspree confirms receipt.
- On a Formspree error, the visitor sees the returned error or a fallback message with the contact address `hello@nextgenerationai360.com`. Network failures show a separate retry message.
- Submissions that fill the honeypot are silently dropped.
- The page asks visitors not to submit emergencies or sensitive personal or operational information.

No API keys or secrets are stored in this repository. The Formspree form ID is public by design.

## Run locally

Open `index.html` directly in a modern browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. Google Fonts (DM Sans and Libre Baskerville) load from the web; system font fallbacks are used when offline.

Test submissions from a local copy are real and will reach the Formspree inbox.

## Deployment

### Current hosting: GitHub Pages

The live site is published by **GitHub Pages** from the root of the `main` branch, with the custom domain set by `CNAME` and HTTPS enabled. Merging to `main` publishes the change automatically, usually within a minute or two.

GitHub Pages does not read `vercel.json`, so its headers and clean-URL settings do not apply to the live site.

### Optional: Vercel

To deploy to Vercel instead, import this repository at [vercel.com/new](https://vercel.com/new), choose the **Other** framework preset, leave the build command empty and set the output directory to `.`. Or, from this folder, run `npx vercel` for a preview and `npx vercel --prod` for production. Moving `communityshields.com` to Vercel would require updating DNS and removing or disabling the GitHub Pages custom domain.

## Editing

- Copy, FAQ and form fields live in `index.html`. Change the same content in `CommunityShields-Standalone.html` to keep the two in sync.
- If you change the domain, update `CNAME`, `robots.txt`, `sitemap.xml`, and the canonical, Open Graph, Twitter and JSON-LD URLs in both HTML files.
- To add or correct a town in the autocomplete, edit the array in `wi-places.js`.

## Launch checklist

- [x] Connect a live Formspree form
- [x] Publish on communityshields.com with HTTPS
- [x] Add `robots.txt`, `sitemap.xml`, canonical and social-sharing metadata
- [x] Add a security reporting policy (`SECURITY.md`)
- [ ] Send a test inquiry after each form change and confirm it arrives in the Formspree dashboard and notification inbox
- [ ] Review Formspree spam protection and restrict the form to the communityshields.com domain
- [ ] Add a privacy policy covering what is collected, how long it is kept, and how to request deletion (Formspree processes submissions)
- [ ] Confirm program ownership and the public contact identity
- [ ] Get written approval before naming any government department or agency as a partner or publishing its needs
- [ ] If donations are ever accepted, add the required disclosures, approvals, accounting and fund-handling procedures first
- [ ] Test on a phone, check all links and proofread the project statements

## Security

See [`SECURITY.md`](SECURITY.md). For emergencies, call 911.
