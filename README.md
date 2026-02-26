# Card Trooper

A minimal PWA for storing and scanning loyalty and store cards. Built for mobile with an Apple-inspired light UI.

## Stack

- **Astro 5** + **React** + **Tailwind CSS**
- **Cloudflare Pages** (hosting) + **Cloudflare D1** (SQLite database)
- **better-auth** (authentication, HTTP-only session cookies)
- **Drizzle ORM** (database queries)

## Local Development

### 1. Install dependencies

```sh
npm install
```

### 2. Create a D1 database

```sh
npx wrangler d1 create card-trooper
```

Copy the database ID into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "card-trooper"
database_id = "your-database-id-here"
```

### 3. Run the migration

```sh
npx wrangler d1 execute card-trooper --local --file=./migrations/0001_init.sql
```

### 4. Set local environment variables

Copy `.env.example` to `.dev.vars` and fill in the values:

```sh
cp .env.example .dev.vars
```

### 5. Start the dev server

```sh
npm run dev
```

## Commands

| Command           | Action                              |
| :---------------- | :---------------------------------- |
| `npm run dev`     | Start local dev server (port 4321)  |
| `npm run build`   | Build for production                |
| `npm run preview` | Preview production build locally    |

## Deployment

Deployed via **Cloudflare Pages** with Git integration. Every push to `main` triggers a new deployment.

Set these in the Cloudflare Pages dashboard under **Settings → Variables and Secrets**:

| Variable            | Description                          |
| :------------------ | :----------------------------------- |
| `BETTER_AUTH_SECRET` | Random secret string for auth       |
| `BETTER_AUTH_URL`   | Your production URL                  |

And under **Settings → Bindings**:

| Binding | Type        | Value        |
| :------ | :---------- | :----------- |
| `DB`    | D1 Database | card-trooper |
