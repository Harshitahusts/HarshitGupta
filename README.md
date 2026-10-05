# Harshit Gupta — Product Manager Portfolio

A compact, premium portfolio for **Harshit Gupta**, Product Manager at Suscin Innovation Labs (GreenTick.ai), building AI-driven B2B SaaS, cybersecurity and compliance products from 0 to 1.

## Structure

`Hero → Experience → Projects → Toolkit → Contact`

- **3D background** (`client/src/three/coreScene.ts`): a noise-displaced, iridescent liquid core with a particle orbit, rendered on a fixed full-screen canvas. Scroll drifts and morphs it, and the pointer tilts it. It is loaded with a dynamic import after first paint, pauses when the tab is hidden, caps pixel ratio, uses less geometry on mobile, respects `prefers-reduced-motion`, and falls back to a CSS glow without WebGL.
- **Content** lives in `client/src/content.ts`. Every fact comes from `client/public/resume.pdf`.
- No horizontal scroll: `overflow-x: clip` on the root, and every grid uses `minmax(0, 1fr)`. Verified at 1440, 390 and 320px widths.

## Featured links

- [LinkedIn](https://www.linkedin.com/in/harshit-gupta-316b35229/)
- [GitHub](https://github.com/Harshitahusts)
- [X](https://x.com/Harshit54283)
- [GRC-Flow](https://grc-flow.com) · [app](https://app.grc-flow.com)
- [GreenTick.ai](https://greentick.ai)
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

Built with React, TypeScript, Vite and three.js. The Manus editor plugins run only under `vite dev`, so they never ship in the production bundle.
