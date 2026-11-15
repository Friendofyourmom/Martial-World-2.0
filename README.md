# Martial World 2.0 — Starter Build 003

This update replaces the Starter Build 002 frontend files with improved mobile spacing in the sign-up character form and hides the hidden appearance-key field correctly.

## What's new
- Sign In / Sign Up tabs in one account popup.
- Sign Up includes email, password, character name, appearance, and background.
- Eight selectable 16-bit Murim character portraits using `assets/appearance-spritesheet.png`.
- Selected appearance is highlighted with an antique-gold border.
- Improved spacing around the character-name label and appearance selector on mobile.
- Correctly hides the internal appearance-key input so it cannot appear as a stray field.
- Uses the existing `create_character` RPC with `p_character_name`, `p_appearance_key`, and `p_background_key`.
- If email confirmation is required, character choices are temporarily saved on the device (no password is stored); after confirming and signing in, character creation is retried.
- If character creation fails after authentication, the player can retry without creating another account.

## Deploy
1. Keep a copy of your current repository files first.
2. Extract this ZIP.
3. Upload and replace the files in the repository root, including the `assets` folder.
4. Commit the changes to the `main` branch.
5. Wait for GitHub Pages to redeploy.

## Supabase
The frontend uses the existing Martial World 2.0 Supabase project and public publishable key in `config.js`. Never place a service-role key or database password in browser code. No database migration is included or required for this UI change.

## Important
This is still a staged frontend. The other game sections remain placeholders. Test sign-up, email confirmation (if enabled), sign-in, character creation, and reload before proceeding to the next build.
