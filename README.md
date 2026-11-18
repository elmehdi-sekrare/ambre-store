<div align="center">

# ambre By El Mehdi<sup>●</sup>

### Everyday sneakers, runners and trail shoes

A complete footwear storefront: animated product hero, shop with filters, 25 product pages,
cart, size finder and help centre. Fully responsive, statically built, deployed on Netlify.

[![Live demo](https://img.shields.io/badge/Live_demo-ambre--ecom--store.netlify.app-111111?style=for-the-badge&logo=netlify&logoColor=white)](https://ambre-ecom-store.netlify.app/)

![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-site_%2B_CMS-0055FF?style=flat-square&logo=framer&logoColor=white)
![Shopify](https://img.shields.io/badge/Shopify-Storefront_API-7AB55C?style=flat-square&logo=shopify&logoColor=white)
![Node](https://img.shields.io/badge/Node-22+-339933?style=flat-square&logo=node.js&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-desktop_·_tablet_·_phone-E8492F?style=flat-square)

<br>

<a href="https://ambre-ecom-store.netlify.app/"><img src="docs/hero.gif" alt="Ambre home page: the hero switching between the Daily, Tempo, Ridge, Court 78 and Float models" width="100%"></a>

</div>

<br>

## ✦ Highlights

- **Animated product hero**: five models (Daily, Tempo, Ridge, Court 78, Float) with giant type, a size ruler, colour swatches, autoplay and prev/next controls.
- **Shop with filters**: 8 categories (Everyday, Court, Slip-ons, Running, Trail, Sandals, Boots, Kids), filter panel, sorting and an empty state.
- **25 product pages**: image gallery with thumbnails, colour and size variants, shipping info, "Made to wear" details and related products.
- **Cart, prices and currencies** through the Shopify Storefront API.
- **Size finder**: drag a slider to your foot length and get US / EU / UK sizes for every model.
- **Help centre, factories, privacy and terms** pages.
- **Scroll and hover animations** across the site.
- **Fast static build**: every page is pre-rendered, all images and fonts are served from the site itself, and nothing is indexed by search engines (test deploy).

<br>

## ✦ Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/desktop-home.webp" alt="Home page hero"><p align="center"><b>Home</b>: product hero</p></td>
    <td width="50%"><img src="docs/desktop-arrivals.webp" alt="New arrivals carousel"><p align="center"><b>New arrivals</b></p></td>
  </tr>
  <tr>
    <td><img src="docs/desktop-shop.webp" alt="Shop page with categories and filters"><p align="center"><b>Shop</b>: categories, filters, sorting</p></td>
    <td><img src="docs/desktop-product.webp" alt="Product page with gallery and variants"><p align="center"><b>Product</b>: gallery, colours, sizes</p></td>
  </tr>
  <tr>
    <td><img src="docs/desktop-fit.webp" alt="Size finder"><p align="center"><b>Size finder</b></p></td>
    <td><img src="docs/desktop-collection.webp" alt="Collection section"><p align="center"><b>Collection</b></p></td>
  </tr>
</table>

### On phone

<p align="center"><img src="docs/phone.webp" alt="Home, shop and product pages on a phone" width="100%"></p>

<br>

## ✦ Pages

| Route | Page |
|---|---|
| `/` | Home: hero, new arrivals, collection, best sellers, factories |
| `/shop` · `/shop/<category>` | Shop, filtered by category |
| `/shoes/<model>` | Product page (25 models) |
| `/fit` | Size finder |
| `/factories` | Where the shoes are made |
| `/help` | Help centre: shipping, returns, care, contact |
| `/privacy` · `/terms` | Legal |

<br>

## ✦ Stack

| | |
|---|---|
| **Site & CMS** | Framer (pages, components, animations, CMS collections) |
| **Commerce** | Framer Commerce + Shopify Storefront API (products, prices, currencies, cart) |
| **Build** | `scripts/build.mjs`: Node script that turns the site into static files for any host |
| **Hosting** | Netlify (auto-deploy on every push to `main`) |

<br>

## ✦ Getting started

```bash
git clone https://github.com/elmehdi-sekrare/whispered-petals-serenade.git ambre
cd ambre
npm start          # builds dist/ and serves it on http://localhost:5300
```

Node 22+. No packages to install.

| Command | What it does |
|---|---|
| `npm run build` | builds the static site into `dist/` |
| `npm start` | build + local preview on port 5300 |

### Change the content
Brand name, email, phone and links live in [`scripts/content.mjs`](scripts/content.mjs). Edit `ME` and rebuild.

<br>

## ✦ Deploy

1. Netlify → **Add new site → Import an existing project → GitHub** → pick this repo.
2. Settings come from [`netlify.toml`](netlify.toml): build `node scripts/build.mjs`, publish `dist`.
3. **Deploy.** Every push to `main` redeploys.

<br>

## ✦ Project structure

```
.
├── site/
│   ├── pages/          pre-rendered HTML for every route
│   ├── x/              scripts, styles, fonts, images and data used by the pages
│   └── index.json      index of the files in site/x/
├── scripts/
│   ├── build.mjs       static build → dist/
│   ├── content.mjs     brand name, contact details, links
│   └── serve.mjs       local preview server
├── docs/               README images
└── netlify.toml        Netlify build settings
```

<br>

## ✦ Contact

**El Mehdi Sekrare**: web developer, Mohammedia, Morocco

[![LinkedIn](https://img.shields.io/badge/LinkedIn-El_Mehdi_Sekrare-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/el-mehdi-sekrare-77000629b)
[![Email](https://img.shields.io/badge/Email-elmehdisekrare%40gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:elmehdisekrare@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-elmehdi--sekrare-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/elmehdi-sekrare)
