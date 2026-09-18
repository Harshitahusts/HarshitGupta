# Harshit Gupta — Product Manager Portfolio

A premium, motion-led portfolio website for **Harshit Gupta**, an Associate Product Manager focused on AI-driven B2B SaaS, cybersecurity, product strategy, and enterprise delivery.

## Included

- Dark editorial visual system with electric lime and coral accents
- Interactive 3D product-orbit hero built with CSS transforms
- Responsive navigation and mobile-first layout
- Selected work section with live links and GitHub links
- Case-study modal for Sarathi and AutoSecT
- Product approach, experience timeline, skills, and social links
- Accessible focus states and reduced-motion support

## Featured links

- [LinkedIn](https://www.linkedin.com/in/harshit-gupta-316b35229/)
- [GitHub](https://github.com/Harshitahusts)
- [X](https://x.com/Harshit54283)
- [Sarathi live product](https://sarathi-school-commute.vercel.app/)
- [Sarathi GitHub repository](https://github.com/Harshitahusts/sarathi-school-commute)
- [Download Harshit Gupta's résumé](/manus-storage/Resume_d0efde8d.pdf)

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

Built with React, TypeScript, Vite, Tailwind CSS, Lucide icons, and CSS 3D transforms.
