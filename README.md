# Value Emergence System

This repository **is** the Value Emergence System itself, serving as an Open Science hub. It aims to foster the field of Value Emergence Systems Science by allowing anyone to contribute through various means, such as submitting articles or participating in discussions.

## Development Environment Setup

There are two ways to set up the development environment:

### 1. Using Dev Containers (Recommended)

This is the easiest way to get started. It ensures a consistent development environment with all dependencies and configurations pre-installed.

**Prerequisites:**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code

**Setup:**

1.  Clone this repository.
2.  Open the cloned repository folder in Visual Studio Code.
3.  VS Code should automatically detect the `.devcontainer/devcontainer.json` file and prompt you to \"Reopen in Container\". Click on it.
4.  Wait for the container to build and start. This might take a few minutes the first time as it downloads the base image and installs dependencies.
5.  Once the container is ready, you can open a terminal within VS Code (Terminal > New Terminal) and run the development server:
    ```bash
    pnpm dev
    ```

### 2. Manual Setup

If you prefer not to use Dev Containers, you can set up the environment manually.

**Prerequisites:**

- Node.js (Check the version specified in `.devcontainer/devcontainer.json` or use the latest LTS version)
- pnpm (Install using `npm install -g pnpm` or follow [official instructions](https://pnpm.io/installation))

**Setup:**

1.  Clone this repository.
2.  Navigate to the project root directory.
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  **Build Presentation Slides:** Slidev presentation assets are not included in the repository. You need to build them locally:
    ```bash
    # Build all existing presentations (check slugs in slidev-decks/)
    # Example for a slide with slug 'my-slide':
    # pnpm run build-slides --slug=my-slide
    # Add commands for other slugs if they exist, e.g.:
    pnpm run build-slides --slug=value-universality
    pnpm run build-slides --slug=social-structure
    pnpm run build-slides --slug=pragmatism
    ```
5.  **(Optional) Install Playwright for Thumbnail Generation:** If you need to generate presentation thumbnails, install Playwright browsers:

    ```bash
    pnpm exec playwright install --with-deps
    ```

    _Note: You might need to install additional OS dependencies for Playwright depending on your system. The command `pnpm exec playwright install --with-deps` attempts to install these, but manual installation might be required (see Playwright documentation). The `prepare:slide:deps` or `generate-thumbnail` scripts also handle this, but require a slug._

6.  Start the development server:
    ```bash
    pnpm dev
    ```

## Available Commands

- **Start Development Server:**

  ```bash
  pnpm dev
  ```

  Open `http://localhost:3000` in your browser.

- **Build Project:**

  ```bash
  pnpm build
  ```

- **Start Production Server (after build):**

  ```bash
  pnpm start
  ```

- **Run Lint:**
  ```bash
  pnpm lint
  ```

## Adding a New Presentation Slide

Workflow to add and manage a new presentation using Slidev:

1.  **Create Slidev Project:**

    - Choose a short, descriptive `slug` (e.g., `new-topic`).
    - Create directory: `mkdir slidev-decks/<slug>`
    - Initialize project: `cd slidev-decks/<slug> && pnpm create slidev@latest . --force --template default`
    - Update package name in `slidev-decks/<slug>/package.json` to match the `<slug>`.
    - Stop dev server (Ctrl+C) if started.
    - Return to project root: `cd ../..`

2.  **Prepare/Edit Markdown Files:**

    - Delete the default `slidev-decks/<slug>/slides.md`.
    - Create/edit language-specific files with your content:
      - `slidev-decks/<slug>/slides.ja.md`
      - `slidev-decks/<slug>/slides.en.md`

3.  **Build Slides:**

    - After editing the markdown files, build the static assets by running these commands from the project root (replace `<slug>`):

      ```bash
      # Build Japanese slides
      pnpm --filter <slug> exec slidev build slides.ja.md --base /ja/presentations/<slug>/ --out ../../public/ja/presentations/<slug>

      # Build English slides
      pnpm --filter <slug> exec slidev build slides.en.md --base /en/presentations/<slug>/ --out ../../public/en/presentations/<slug>
      ```

4.  **Update Presentation Manifest:**

    - Edit `content/presentations/manifest.ts`.
    - Add or update the entry for your `<slug>` in the `presentationsManifest` array. Include multilingual `title` and `description`.
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

    - To generate a thumbnail from the first slide:
      - **Install dependencies (run once per slide project):**
        ```bash
        pnpm --filter <slug> add -D playwright-chromium && pnpm --filter <slug> exec playwright install --with-deps
        ```
      - **Export and place the thumbnail:**
        ```bash
        pnpm --filter <slug> exec slidev export slides.en.md --format png --range 1 --output ../../public/images/thumbnails/temp-export && mv public/images/thumbnails/temp-export/1.png public/images/thumbnails/<slug>.png && rm -rf public/images/thumbnails/temp-export
        ```
    - Alternatively, create/update `public/images/thumbnails/<slug>.png` manually.

6.  **Verify:**
    - Run `pnpm dev`.
    - Check the `/concepts` page for the presentation listing.
    - Verify the presentation link `/[lang]/presentations/<slug>/` works.
    - Verify the thumbnail appears correctly.

**Note:** When you update the slide content (Markdown files), remember to run the build commands (Step 3) again. If the first slide changed significantly, also run the thumbnail generation commands (Step 5) to update the thumbnail.
