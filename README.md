# Solana Clicker

## Documentation

Project is based on `Next.js`, a production-ready React Framework. Check out the [documentation](https://nextjs.org/docs) for more information.

## Prerequisites

- `node`
- `npm`

## Usage

**Firstly, install all necessary dependencies:**

```sh
npm install
```

**To start a development server:**

```sh
npm run dev
```

**To build the app for production:**

```sh
npm run build
npm start
```

## Folder structure

```
template-next/
├── config (theme)
├── public
├── shared (shared files - css, validation, etc.)
└── src
    ├── components (inspired by atomic design principles)
    │   ├── elements (small building blocks)
    │   ├── layouts (wrappers for templates)
    │   ├── modules (more building blocks together)
    │   └── templates (page specific content)
    ├── graphql (each module and its queries and mutations)
    ├── i18n (translations)
    ├── pages
    ├── services (graphql client and other services)
    ├── stores (state management)
    └── types (more complex interfaces)
```

## What's Inside

- React Framework

  - [Next.js](https://nextjs.org)

- Type-checking

  - [TypeScript](https://www.typescriptlang.org/docs/home.html)

- Code quality tools

  - [Prettier](https://prettier.io/)
  - [ESLint](https://eslint.org/)

- Other
  - [Sentry](https://sentry.io/welcome/)
