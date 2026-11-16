# PlazoFiscal site

Presentation site of the PlazoFiscal platform, a Kubernetes platform for the tax deadlines of small accounting firms in Colombia. One page walks through the business case, the application, the architecture, the rolling releases, the network policies and storage, scaling by load and by the filing calendar, observability, sign-in with a second factor, the way the work was organized, and the evidence behind each claim, with twelve recordings of the live platform.

The site is static. It reads no live service, and the clients and users on the screens are examples.

## Run it

It needs Node.js 22 or later.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # writes dist/
```

A push to `main` builds the site and publishes it with GitHub Pages through `.github/workflows/deploy.yml`. The build uses a relative base, so it works on the organization domain and under a repository path.

## Layout

| Path | Content |
|---|---|
| `index.html` | Sections and static copy |
| `src/data.js` | Figures, lists, configuration excerpts and links that the page renders |
| `src/main.js` | Rendering, scroll animation and the interactive parts |
| `src/style.css` | Styles, built on the PlazoFiscal colors |
| `public/img/diagrams/` | The three architecture diagrams |
| `public/img/shots/` | Screenshots of the platform |
| `public/videos/` | The twelve recordings at 1080p, each with a poster |
| `scripts/assets.mjs` | Rebuilds the diagrams and screenshots from the platform repository |
| `scripts/videos.sh` | Encodes the recordings for the web and cuts their posters |

The page uses Vite, GSAP with ScrollTrigger and Lenis. Inter and IBM Plex Mono are bundled through Fontsource, so the site loads no font from another host.

## Where the content comes from

Every figure on the page comes from a document of the [platform repository](https://github.com/plazofiscal-devops/plazofiscal-platform). When a figure changes there, change it in `src/data.js` or `index.html`.

| Section | Source |
|---|---|
| Case and objectives | `docs/business-case.md` |
| Platform, capacity, rollout, policies, storage, scaling, observability and sign-in | `docs/architecture.md` |
| Commands | `docs/operations.md` and the `Makefile` |
| Evidence | `docs/evidence.md` |
| Configuration excerpts | The files named above each excerpt, some of them shortened for reading |

## Rebuild the media

The diagrams and screenshots come from the platform repository, cloned next to this one, and the recordings from a folder of original MP4 files at 1440p.

```bash
npm run assets                     # diagrams and screenshots, needs sharp
npm run assets -- <path>           # reads another clone
npm run videos -- <folder>         # web versions and posters, needs ffmpeg with libx264 and libwebp
```

The panel of replicas in the scaling section is a screenshot of the PlazoFiscal dashboard taken during a load run, kept in `public/img/shots/`.

## Identity

Colors and type follow the application. Charcoal `#121212` is the canvas of the brand, amber `#f2c14e` marks what matters and is never body text, and red `#e05d5d` marks a problem. The dot calendar with one amber dot is the signature, and the wordmark sets Plazo light and Fiscal bold.

PlazoFiscal is an invented company for an academic exercise of Universidad Icesi, 2026. It has no link with any tax authority, and its figures are assumptions.
