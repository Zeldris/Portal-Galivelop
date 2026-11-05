# Project note of gw-seo

The note is `.claude/gw/gw-seo.md` in the project: `key: value` lines (keys in English), plus free text for what the
keys do not cover. The workflow neither creates nor overwrites it. Without it the defaults apply and you say so once.

| Key | Default | Holds |
|---|---|---|
| Build command | `npm run build` | the command that produces the static site |
| Build dir | `dist` | the folder `comprobar.py` reads |
| Site | the `Sitemap:` line of `robots.txt` | the absolute base URL, ending in `/` |
| Languages | the hreflang values found | the languages every page must exist in (ISO 639-1, comma-separated) |
| Ignore | none | extra globs for `--ignore` (`404.html`, `google*.html` and `assets/*` are always ignored) |
| Generator | none | the source files that write the `<head>`, the sitemap and `robots.txt`: where fixes go |
| Rules | none | the project's own SEO rules (a review checklist, a research note) |
