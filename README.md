# Portfolio Site for Finlay

## Core Technologies

- **Framework**: Nuxt.js (v3)
- **UI Library**: Vue.js (v3)
- **Content Management**: Nuxt Content (v2)
- **Styling**: Tailwind CSS with DaisyUI plugin
- **Image Handling**: Combination of custom scripts, Nuxt Image (likely via a custom `<Image>` component), `@unlazy/nuxt`, and server middleware.
- **Icons**: Nuxt Icon
- **State Management (Implicit)**: Nuxt's `useState` for shared reactive state (e.g., site constants).

## In-Depth Architecture & Data Flow

This project has several key architectural patterns and data flows:

### 1. Centralized Configuration via `options.md`

- **File**: `content/general/options.md`
- **Format**: Custom key-value store (e.g., `site.title: My Site Name`). Not standard Markdown.
- **Role**: This file is the **single source of truth** for global site settings, contact information, reusable UI text snippets (used on homepage, contact page, work page, teaching page, etc.), and some global image URLs.
- **Access**:
    - A composable, likely `composables/useConstants.ts` (not explicitly shown but its usage pattern is clear), reads this file.
    - It then likely uses `useState('site-constants', () => parsedOptions)` to make these values available reactively throughout the application.
    - Pages and components access these constants using `const constants = await useConstants();` or by consuming the `useState('site-constants')` directly (as seen in `useSiteMeta`).
- **Impact**: Changes to text, contact details, or global settings are primarily made in `options.md`.

### 2. Content Sourcing with Nuxt Content

- **Content Types**:
    - **General Content Snippets** (`content/general/*.md` excluding `options.md` and `header.md`): Standard Markdown files, often used for larger text blocks (e.g., `long_about.md`).
    - **Navigation** (`content/general/header.md`): Custom list format for main navigation links.
    - **Media Items** (`content/media/**/index.yaml`): Defined in YAML files, with associated image files typically co-located. Schema enforced by `content.config.ts`.
    - **Compositions/Pieces** (`content/pieces/*.md`): Markdown files with extensive front matter for details like type, category, duration, score/audio links.
    - **Writing** (`content/writing/*.md`): Markdown files with front matter for title, description, and date.
- **Data Fetching**:
    - Pages (e.g., `pages/work/pieces/[slug].vue`, `pages/media.vue`) use Nuxt Content's `queryContent()` (often via a custom wrapper like `queryCollection()`) to fetch data.
    - Individual items are fetched by slug: `queryContent('pieces').path('/slug').first()`.
    - Collections are fetched using `.all()`: `queryContent('media').all()`.
- **Rendering**:
    - The `<ContentRenderer :value="post" />` component is used in page templates (e.g., `pages/work/pieces/[slug].vue`) to render the Markdown body of fetched content.
    - Front matter data is accessed directly from the fetched object (e.g., `post.value.title`, `post.value.meta.audio`).

### 3. SEO and Metadata Management

- **`composables/useSiteMeta.ts`**:
    - Dynamically sets HTML meta tags (title, description, keywords, Open Graph, Twitter cards) for each page.
    - Pulls default values from the global constants (derived from `options.md`).
    - Allows page-specific overrides. For example, the page title is often constructed as `Page Specific Title | Global Site Title`.
- **`composables/useStructuredData.ts`**:
    - Generates JSON-LD structured data snippets (Schema.org types like `Person`, `Article`, `MusicComposition`).
    - This enhances SEO by providing machine-readable information about the content.
    - Also uses global constants for fallback data (e.g., author name).

### 4. Image Handling Strategy

The project employs a multi-faceted approach to image management:

- **Source Location**: Images referenced by `content/media/**/*.yaml` files are typically stored alongside the YAML file (e.g., `content/media/my-gallery/image.jpg`).
- **`scripts/copy-content-images.js`**:
    - **Action**: During `dev`, `build`, and `generate`, this script recursively copies all image files (based on extension) from subdirectories within `content/` (e.g., `content/media/`, `content/pieces/`) to corresponding subdirectories in `public/`.
    - **Behavior**: Crucially, it **first deletes the target subdirectory** in `public/` (e.g., `public/media/`) before copying. This ensures `public/<subdir>/` is a clean mirror of `content/<subdir>/` for images.
    - **Result**: Makes images accessible via static URLs like `/media/my-gallery/image.jpg`.
- **`server/middleware/serve-images.ts`**:
    - **Action**: This Nuxt server middleware intercepts HTTP requests for image paths.
    - **Behavior**: If an image URL is requested, it attempts to read the file directly from the `content/` directory (e.g., if `/media/my-gallery/image.jpg` is requested, it looks for `content/media/my-gallery/image.jpg`).
    - **Purpose**: This might serve as a fallback if the copy script hasn't run, or for images not intended to be copied to `public/` (though the copy script is quite broad). It could also facilitate faster serving in development before the full copy process completes.
- **Custom `<Image>` Component (e.g., in `pages/media.vue`)**:
    - This component (definition not shown) likely uses `@nuxt/image` or `@unlazy/nuxt`.
    - It takes an `imgid` (e.g., `my-gallery/image.jpg`, derived from the YAML path) and constructs the final `src` URL, probably pointing to the path in `public/` created by the copy script.
    - It handles aspects like lazy loading, responsive sizes, and possibly blurhash placeholders.
- **Blurhashes**:
    - `scripts/generate-blurhash.mjs` is used to generate `blurhash` strings, which are stored in the `content/media/**/index.yaml` files. These are used by the `<Image>` component for better perceived loading performance.
- **External Images**: Some URLs in `options.md` or front matter point to external image hosts (e.g., `picsum.photos`, `unsplash.com`).

### 5. Audio Handling

- Audio files (e.g., `mp3`) are referenced in the front matter of `content/pieces/*.md` (e.g., `audio: /audio_demo.mp3`).
- These paths are relative to the `public/` directory. So, `audio_demo.mp3` should be placed in `public/audio_demo.mp3`.
- `pages/work/pieces/[slug].vue` contains a custom Vue-based audio player that uses these paths.

## Project Structure Highlights

(Standard Nuxt directories like `assets`, `layouts`, `plugins`, `middleware` are assumed to follow Nuxt conventions if present.)

- **`components/`**: Contains reusable Vue components.
    - `components/HomePage.vue`, `components/TeachingPage.vue`: These appear to be page-level components, encapsulating the structure of those specific pages.
    - `components/Card.vue`, `components/Header.vue`, `components/Navigation.vue`: Generic UI components.
    - `components/Image.vue`: The custom image component mentioned above.
- **`composables/`**:
    - `useSiteMeta.ts`: Manages page metadata and SEO tags.
    - `useStructuredData.ts`: Generates JSON-LD structured data.
    - `useConstants.ts` (inferred): Responsible for loading and providing data from `content/general/options.md`.
    - `useFile.js` (in `utils/` but acts like a composable): Potentially for file system interactions, though its exact use isn't clear from current context.
- **`content/`**: Core of the site's data.
    - `content/general/options.md`: Global site configuration (critical).
    - `content/general/header.md`: Main navigation links.
    - `content/media/`: YAML files defining media items, with images often co-located.
    - `content/pieces/`: Markdown for musical compositions.
    - `content/writing/`: Markdown for Writings.
- **`pages/`**: Defines the site's routing.
    - Structure includes static routes (e.g., `about.vue`, `media.vue`) and dynamic routes for content items (e.g., `work/pieces/[slug].vue`).
- **`public/`**: Static assets.
    - Critically, this directory gets populated with images from `content/` by the `scripts/copy-content-images.js` script.
    - Manually placed assets like `favicon.ico`, `audio_demo.mp3` also reside here.
- **`scripts/`**: Node.js utility scripts.
    - `copy-content-images.js`: Copies images from `content/` to `public/`. (Essential)
    - `generate-blurhash.mjs`: Generates blurhash strings for images.
- **`server/middleware/serve-images.ts`**: Nuxt server middleware for dynamic image serving from the `content/` directory.
- **`nuxt.config.ts`**: Main Nuxt configuration (modules, build settings, etc.).
    - Modules used: `@nuxt/content`, `@nuxt/icon`, `@nuxt/image`, `@unlazy/nuxt`.
    - Configured for static site generation (`nitro: { preset: "static" }`).
- **`EDITING.md`**: Detailed guide on how to edit content, including schemas for each content type.

## Non-Obvious Features & Configurations

- **Dual Image Serving**: The combination of `scripts/copy-content-images.js` (populating `public/`) and `server/middleware/serve-images.ts` (serving directly from `content/`) offers flexibility but also complexity in understanding image path resolution. The copy script's behavior of cleaning the target directory is important.
- **`options.md` as a Central Data Hub**: The reliance on `content/general/options.md` for so much site data, accessed via `useConstants`, is a key project-specific pattern.
- **Custom Audio Player**: The piece display page (`pages/work/pieces/[slug].vue`) implements a full custom audio player logic.
- **Static Site Generation**: The site is built as a static site, meaning all content is pre-rendered into HTML files for optimal performance and hosting.

## Setup and Development

1.  **Prerequisites**:
    *   Node.js (check `package.json` for engine specifics, or use a recent LTS version)
    *   npm (or your preferred package manager like yarn or pnpm)

2.  **Installation**:
    ```bash
    npm install
    ```

3.  **Development Server**:
    Starts a local development server with hot reloading. Also runs `copy-content-images.js`.
    ```bash
    npm run dev
    ```
    Usually runs on `http://localhost:8000`.

4.  **Building for Production (Static Site Generation)**:
    Builds the application for deployment. Also runs `copy-content-images.js`.
    ```bash
    npm run build
    # OR
    npm run generate
    ```
    Output is in the `.output/public/` directory.

5.  **Previewing Production Build**:
    ```bash
    npm run preview
    ```

6.  **Other Key Scripts**:
    - `npm run generate-blurhash`: Manually triggers the blurhash generation for images.
    - `npm run copy:assets`: Manually triggers the content image copying script.

## Deployment

Deploy the contents of the `.output/public/` directory (after running `npm run generate` or `npm run build`) to any static hosting platform (e.g., Netlify, Vercel, GitHub Pages).

## Editing Content

Refer to **`EDITING.md`** for detailed instructions on content schemas and how to add or modify content in this project.
```
