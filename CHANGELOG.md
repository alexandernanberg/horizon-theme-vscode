# Horizon Changelog

All notable changes to Horizon will be documented in this file.

## Unreleased

- Add bracket pair colors (`editorBracketHighlight.*`) from the Horizon palette
- Set `editor.foreground` explicitly instead of relying on the VS Code default
- Replace deprecated `editorIndentGuide.background`/`activeBackground` with the `*1` keys
- Use the empty string instead of `normal` for `fontStyle`, as required by the theme schema
- Color `punctuation.quasi.element` in the Bright variants, matching the dark ones
- Merge the two build scripts into one that validates every color and font style
- Exclude sources, lockfile and preview image from the published package
- Require VS Code 1.83+ (`semanticHighlighting` already required 1.43+)
- Add CI that verifies `themes/` is built from `src/`

## 1.0.1

- Enable `semanticHighlighting`

## 1.0.0

- 🎉 Initial release 🎉
