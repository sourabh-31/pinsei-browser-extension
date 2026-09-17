# 📌 Pinsei — Firefox Extension

A compact, mini version of [Pinsei](../pinsei-bookmark-manager) that lives in the
Firefox toolbar. Sign in with your existing Pinsei account to:

- 💾 Save the current tab in one click (choose a folder, or leave it Unsorted)
- 📁 Browse your folders (including the built-in Unsorted / Favourites) and search within them
- 🔗 Open any saved bookmark in a new tab
- 🗑️ Delete a bookmark (soft-delete, recoverable from the Bin in the web app), with a quick Undo

Creating folders, renaming, editing, and permanent delete stay in the main web app —
this extension is intentionally read + quick-capture only.

## 🛠️ Tech

Same stack as the main app: React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query,
and the same Supabase project — so signing in here uses the same account as the web app.
Auth session is persisted with `browser.storage.local` (not `localStorage`, which doesn't
reliably survive a popup closing).

## 🚀 Development

```bash
pnpm install
pnpm build
```

This produces an unpacked extension in `dist/`.

### 🦊 Load it in Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `dist/manifest.json`

The Pinsei icon appears in the toolbar. Temporary add-ons are removed when Firefox
closes, so you'll need to reload it each session (or use `web-ext run`, below).

### 🔄 Iterating on changes

After editing source, re-run `pnpm build`, then click **Reload** next to the extension
on `about:debugging`. For auto-reload on save instead of doing that by hand:

```bash
pnpm dlx web-ext run --source-dir=dist --target=firefox-desktop
```

(run `pnpm build --watch` in another terminal so `dist/` stays up to date).

> **Note:** `pnpm dev` alone won't give you a working popup preview — the `browser.*` APIs
> (tabs, storage) only exist inside an actual loaded extension, not a plain browser tab.

## 📝 Notes

- 🔒 The extension only requests `activeTab` (not broad tab access) and `storage` —
  it can read the current tab's URL/title/favicon only when you open the popup.
- 👤 Sign-up isn't implemented here; create your account in the web app first, then sign in.

## ☕ Support

If you find Dropsei useful, consider [buying me a coffee](https://www.buymeacoffee.com/sourabh0003).

## 📄 License

This project is licensed under the [MIT License](LICENSE).
