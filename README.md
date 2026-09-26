# Happy Birthday Krixia 🍓

A small interactive birthday website built as a Vite + TypeScript project.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Build for production

```bash
npm run build
```

The production site is written to `dist/`.

## Real birthday media

The photo booth contains the three supplied photos in `public/images/photo-01.jpg`, `photo-02.jpg`, and `photo-03.jpg`. Clicking a printed photo opens a large viewer so the picture can be seen clearly.

The TV room uses the supplied video at `public/videos/birthday-video.mp4`.

## Letter names

- Pompompurin — Sean
- Kuromi — Nissi
- Kerropi — Marklie
- Cinnamorol — Ethan
- Hello Kitty — Pane

The five messages are stored in `src/data/letters.ts` exactly as supplied.

## GitHub Pages

1. Create a GitHub repository and put the contents of this folder in the repository root.
2. Push the repository to the `main` branch.
3. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The included workflow at `.github/workflows/deploy.yml` will build and deploy the site after each push to `main`.

The Vite config already uses a relative base (`./`), and the HTML/asset links are relative, so this project works as a GitHub Pages project site without needing to hard-code a repository name.

## XAMPP

XAMPP is not required. Use Vite for development and GitHub Pages for hosting.

## GitHub Pages deployment

This project is a Vite multi-page site. GitHub Pages must deploy the **built `dist/` directory**, not the repository root. The included `.github/workflows/deploy.yml` installs dependencies, runs `npm run build`, uploads `dist/`, and deploys it to GitHub Pages.

In repository Settings → Pages, keep **Source = GitHub Actions**. Do not use the generic Static HTML workflow for this project.
