# Martial World 2.0 — Starter Build 001

A mobile-first, static web frontend starter for the new Martial World 2.0 project.

## Included in this build

- Dark charcoal and antique-gold visual theme
- Responsive desktop sidebar and mobile bottom navigation
- Persistent LP, Energy, Ki, Knowledge and Silver HUD
- Home dashboard and dedicated section placeholders
- Supabase email sign-up and sign-in
- Character loading from `public.characters`
- Character creation through `create_character`
- Resource loading from `public.character_resources`

## Important status note

This is the **first frontend shell**, not the complete game. Most sub-sites are intentionally placeholders. The Home page contains some illustrative text. It does not yet implement training, meditation, combat, travel, inventory actions, marketplace actions, guild management or chat interactions.

## Supabase configuration

`config.js` is prefilled with the Martial World 2.0 project URL and its public publishable client key.

Only a Supabase **publishable** key belongs in browser code. Never add a service-role key, database password, or secret key.

If the publishable key is rotated, update `supabasePublishableKey` in `config.js`.

## Run locally

Because this project uses browser JavaScript modules from a CDN, serve the folder over HTTP rather than opening `index.html` as a file.

For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to a new GitHub repository

1. Create a **new, separate** GitHub repository for Martial World 2.0.
2. Upload the contents of this folder (the files inside it, not an extra nested folder).
3. In the repository settings, open **Pages**.
4. Choose deployment from the `main` branch and the root folder.
5. Save and wait for GitHub Pages to publish.

Do not replace or edit the old Martial World repository during this stage.

## Database expectations

The frontend currently expects these already-installed database objects:

- `public.characters`
- `public.character_resources`
- RPC `public.create_character(text, text, text)`

The app reads the authenticated user's single character by `owner_id`. It uses the existing secure RPC for character creation rather than inserting directly into the table.

If the live database returns a schema or permission error, stop and inspect the exact error before changing migrations.
