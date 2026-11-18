# Ambre by El Mehdi

Storefront site for **Ambre**: everyday sneakers, runners and trail shoes.
Home, shop with category filters, 25 product pages with colour and size variants, cart,
size finder, factories, help centre and legal pages. Responsive (desktop, tablet, phone).

## Run locally
```
npm run build    # builds the static site into dist/
npm start        # build + preview on http://localhost:5300
```
Node 22+, no dependencies to install.

## Deploy (Netlify)
Connect the repo in Netlify. `netlify.toml` already sets:
- build command: `node scripts/build.mjs`
- publish directory: `dist`

Every push to `main` redeploys.

## Structure
| Path | What |
|---|---|
| `site/pages/` | pre-rendered HTML for every route |
| `site/x/` | scripts, styles, fonts, images and data used by the pages |
| `site/index.json` | index of the files in `site/x/` |
| `scripts/content.mjs` | brand name, contact details and links (edit here) |
| `scripts/build.mjs` | builds `dist/` for static hosting |
| `scripts/serve.mjs` | local preview server |

## Contact
El Mehdi Sekrare · elmehdisekrare@gmail.com · [LinkedIn](https://www.linkedin.com/in/el-mehdi-sekrare-77000629b)
