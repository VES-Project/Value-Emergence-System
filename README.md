# Value Emergence System

This repository **is** the Value Emergence System itself, serving as an Open Science hub. It aims to foster the field of Value Emergence Systems Science by allowing anyone to contribute through various means, such as submitting articles or participating in discussions.

## Setup Instructions

1.  **Install Node.js and pnpm:**
    *   Ensure you have Node.js (check recommended version) and pnpm installed.
2.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

## Available Commands

*   **Start Development Server:**
    ```bash
    pnpm dev
    ```
    Open `http://localhost:3000` in your browser.

*   **Build Project:**
    ```bash
    pnpm build
    ```

*   **Start Production Server (after build):**
    ```bash
    pnpm start
    ```

*   **Run Lint:**
    ```bash
    pnpm lint
    ```

## Adding a New Presentation Slide

Workflow to add and manage a new presentation using Slidev:

1.  **Create Slidev Project:**
    *   Choose a short, descriptive `slug` (e.g., `new-topic`).
    *   Create directory: `mkdir slidev-decks/<slug>`
    *   Initialize project: `cd slidev-decks/<slug> && pnpm create slidev@latest . -y`
    *   Enter package name: `<slug>` (e.g., `new-topic`). **Important:** Use the slug itself as the package name for filter commands to work correctly.
    *   Stop dev server (Ctrl+C) if started.
    *   Return to project root: `cd ../..`

2.  **Prepare/Edit Markdown Files:**
    *   Delete the default `slidev-decks/<slug>/slides.md`.
    *   Create/edit language-specific files with your content:
        *   `slidev-decks/<slug>/slides.ja.md`
        *   `slidev-decks/<slug>/slides.en.md`

3.  **Build Slides:**
    *   After editing the markdown files, build the static assets by running these commands from the project root (replace `<slug>`):
        ```bash
        # Build Japanese slides
        pnpm --filter <slug> exec slidev build slides.ja.md --base /ja/presentations/<slug>/ --out ../../public/ja/presentations/<slug>

        # Build English slides
        pnpm --filter <slug> exec slidev build slides.en.md --base /en/presentations/<slug>/ --out ../../public/en/presentations/<slug>
        ```

4.  **Update Presentation Manifest:**
    *   Edit `content/presentations/manifest.ts`.
    *   Add or update the entry for your `<slug>` in the `presentationsManifest` array. Include multilingual `title` and `description`.
        ```typescript
        {
          slug: "<slug>",
          thumbnail: "<slug>.png", // Set the expected thumbnail filename
          published: true,
          title: { en: "...", ja: "..." },
          description: { en: "...", ja: "..." },
        },
        ```

5.  **Generate Thumbnail (Optional):**
    *   To generate a thumbnail from the first slide:
        *   **Install dependencies (run once per slide project):**
            ```bash
            pnpm --filter <slug> add -D playwright-chromium && pnpm --filter <slug> exec playwright install --with-deps
            ```
        *   **Export and place the thumbnail:**
            ```bash
            pnpm --filter <slug> exec slidev export slides.en.md --format png --range 1 --output ../../public/images/thumbnails/temp-export && mv public/images/thumbnails/temp-export/1.png public/images/thumbnails/<slug>.png && rm -rf public/images/thumbnails/temp-export
            ```
    *   Alternatively, create/update `public/images/thumbnails/<slug>.png` manually.

6.  **Verify:**
    *   Run `pnpm dev`.
    *   Check the `/concepts` page for the presentation listing.
    *   Verify the presentation link `/[lang]/presentations/<slug>/` works.
    *   Verify the thumbnail appears correctly.

**Note:** When you update the slide content (Markdown files), remember to run the build commands (Step 3) again. If the first slide changed significantly, also run the thumbnail generation commands (Step 5) to update the thumbnail. 
