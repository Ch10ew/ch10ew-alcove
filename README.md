# Ch10ew Alcove

My personal website, built with Next.js 15.

## Features

- **Static export** - Fully static HTML output with zero server dependencies.
- **MDX content compiling** - MDX will be compiled into HTML.
- **Responsive design** - Mobile-first, but also works on Desktop.

## Project Structure

- **app** - App Router pages, layouts
- **components** - Reusable components
- **content** - MDX pages
- **lib** - Utility functions
- **public** - Static assets

## Getting Started

### Install dependencies

```bash
npm install
# or
yarn install
```

### Run the development server

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 to view it in your browser.

### Build for production

```bash
npm run build
```

The static files will be generated in the `out/` directory.
