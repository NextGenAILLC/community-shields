# Community Shields — launch-ready static website

A responsive civic-unity landing page, using plain HTML/CSS/JavaScript. No npm install, database, or framework required. Includes site imagery, favicon, light/dark mode, mobile navigation, FAQ, an interest form and Formspree submission handling.

## 1. Connect the actual contact inbox (required for live delivery)

1. Create or sign in to **[Formspree](https://formspree.io/)**.
2. Create a new form (e.g. **Community Shields – Community interest**), and configure the recipient/notification email **inside your Formspree account**. Complete any email verification the service requests.
3. Copy the Formspree form endpoint, which looks like `https://formspree.io/f/abcdefgh` (your ID will be different).
4. In `index.html`, find this exact line:

   ```html
   <form id="interest-form" action="https://formspree.io/f/mppqygnw" method="POST" novalidate>
   ```

   Replace `REPLACE_WITH_YOUR_FORM_ID` with your real form ID. Save.
5. Submit one test inquiry and verify you receive it in the Formspree dashboard and configured notification inbox. Configure domain and spam protections as appropriate in Formspree.

**Important:** The downloaded file does **not** include a live Formspree ID because access to your Formspree account has not been provided. Until configured, the form *validates user input and creates a copyable draft*, but it **does not transmit a message** or claim to have sent one. There is no hardcoded email address, API secret, or hidden backend.

### Form fields delivered to Formspree

- Name, email, town/community, role, optional message, and explicit permission-to-contact checkbox
- An automated email subject; an invisible honeypot (`_gotcha`) for basic bot deterrence

Visitors receive clear success/error messages only after the Formspree response. No sensitive operational, personal, or emergency reports should be collected through this interest form.

## 2. Run locally

Open `index.html` directly in a modern browser. Or use a local web server:

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`. The page works without building. The online Google Fonts are optional; system font fallbacks are included.

## 3. Deploy to Vercel

- **Fastest:** Go to [Vercel](https://vercel.com/new), create a static project, and upload/import this folder via a GitHub repository. Select **Other** framework, no build command, and output directory `.` (root).
- **CLI alternative:** From this directory, run `npx vercel` to preview; then `npx vercel --prod` to deploy when you approve going public.
- Point your chosen domain to the project in Vercel's dashboard when ready.

The included `vercel.json` applies a few standard protective response headers. There are no serverless functions and no environment variables required for the static site.

## 4. Edit the copy or imagery

- `index.html`: headings, text, questions, form endpoint
- `styles.css`: design, layout, typography, responsive breakpoints
- `script.js`: interactive theme/menu and contact submission behavior
- `assets/*.webp`: illustrative **AI-generated concept imagery** derived from the design; not documentary photographs of actual Wisconsin places or partnered departments
- `favicon.svg`: scalable shield icon

A fully portable, **self-contained single-file HTML** version is also provided separately as `CommunityShields-Standalone.html`. To activate Formspree there, edit its same `action=` setting.

## 5. Launch status (verified 2026-10-19)

- [x] Live at https://communityshields.com on GitHub Pages, HTTPS enforced; `www` and `http` redirect to the main domain
- [x] Formspree form `mppqygnw` connected; a test submission returned `ok: true`
- [x] Privacy policy published at `/privacy` and linked from the form and footer
- [x] Custom 404 page (`404.html`)
- [x] Sitemap, robots.txt, canonical URL, social cards, and one valid Organization JSON-LD block
- [ ] Formspree dashboard: turn on spam filtering/reCAPTCHA and restrict submissions to `communityshields.com`
- [ ] Get approval before naming any government department as an official partner or publishing its needs
- [ ] If you later accept donations, add proper disclosures, approvals, accounting, and clear handling of funds

This is a public **interest site**. It is not a database-backed community portal or an emergency-response service.
