# Contributing

This document outlines guidelines for contributing to UB StructStudio.

## Getting Started

1. Fork the repository
2. Clone your fork
3. `npm install` to install dependencies
4. `npm start` to start the dev server at `localhost:3000`

Requires Node.js (LTS version recommended).

## Project Structure

- `src/algo/` -- Algorithm implementations (READ-ONLY during UI work)
- `src/anim/` -- Animation engine (core API in `AnimationMain.js`)
- `src/screens/` -- Top-level page components
- `src/components/` -- Reusable UI components
- `src/css/` -- Stylesheets with CSS custom properties for theming

## Animation API

The animation API is documented inline in `src/anim/AnimationMain.js`. Existing algorithm files in `src/algo/` are the best reference for how to use it.

## Code Style

Before submitting a pull request, ensure your code passes linting and formatting:

```bash
npm run lint
npm run prettier
```

## Submitting a Pull Request

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `npm run build` succeeds
4. Open a pull request against `main` on [JoshuaCongHu/cse250DSA](https://github.com/JoshuaCongHu/cse250DSA)
5. Include a clear description of the changes and reference any related issues
