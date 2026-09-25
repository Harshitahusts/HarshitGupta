# Harshit Gupta — Product Manager Portfolio

A premium, motion-led portfolio website for **Harshit Gupta**, an Associate Product Manager focused on AI-driven B2B SaaS, cybersecurity, product strategy, and enterprise delivery.

## Concept — "The journey of a product"

The site is structured as a product lifecycle, and each stage is backed by real evidence from the résumé or the Sarathi design document:

`Hero → Idea → Discover → Define → Build → Launch → Measure → Iterate → Next → Work → How I think → Experience → About → Contact`

- **3D journey** (`client/src/three/journeyScene.ts`) — one three.js particle system that morphs through nine formations as you scroll (scroll = time). It loads with a dynamic import after first paint, renders only while visible, caps the device pixel ratio, uses fewer particles on mobile, switches to discrete cuts under `prefers-reduced-motion`, and falls back to a static illustration without WebGL. All content is real HTML; the canvas is decorative (`aria-hidden`).
- **Case studies** (`client/src/components/portfolio/CaseStudies.tsx`) — AutoSecT (flagship, with an illustrative findings-verification flow), Sarathi (users, custody chain, prioritisation, pilot targets) and BoloForms (latency drawn to scale).
- **Content** lives in `client/src/content.ts`, with a source note for every fact. Don't add numbers that aren't in the résumé or the Sarathi docs.

## Featured links

- [LinkedIn](https://www.linkedin.com/in/harshit-gupta-316b35229/)
- [GitHub](https://github.com/Harshitahusts)
- [X](https://x.com/Harshit54283)
- [Sarathi live product](https://sarathi-school-commute.vercel.app/)
- [Sarathi GitHub repository](https://github.com/Harshitahusts/sarathi-school-commute)
- [Sarathi product design & lifecycle document](https://github.com/Harshitahusts/sarathi-school-commute/blob/main/docs/complete-product-design-and-lifecycle-document.pdf)
- [Download Harshit Gupta's résumé](/resume.pdf)

## Contact

- Email: guptaharshit619@gmail.com
- Phone: +91-9522012835

## Run locally

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm check
pnpm build
```

## Deploy to Vercel

This project is configured for Vercel deployment with `vercel.json`. Import the repository into Vercel with the project root set to the repository root; Vercel will run `pnpm install --frozen-lockfile`, execute `pnpm vercel-build`, and serve the generated `dist/public` directory. SPA rewrites are included so the site remains reliable on direct route loads.

## Notes

The portfolio separates **Personal projects** (Sarathi) from **Professional career** (AutoSecT at Kratikal Tech and BoloForms). The professional career entries intentionally do not include live-product or repository links.

Built with React, TypeScript, Vite, three.js and Lucide icons. The Manus editor plugins run only under `vite dev`, so they never ship in the production bundle.
