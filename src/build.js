import mustache from 'mustache'
import fs from 'node:fs'
import path from 'node:path'

// Colors are not HTML; never escape rendered values.
mustache.escape = (text) => text

const COLOR_RE = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/
// Mirrors the pattern in VS Code's color theme schema.
const FONT_STYLE_RE = /^(\s*\b(italic|bold|underline|strikethrough))*\s*$/

const families = [
  { dir: 'dark', themes: ['horizon', 'horizon-italic', 'horizon-bold'] },
  {
    dir: 'bright',
    themes: ['horizon-bright', 'horizon-bright-italic', 'horizon-bright-bold'],
  },
]

const outDir = path.join(import.meta.dirname, '..', 'themes')
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

function validate(theme, name) {
  const errors = []
  for (const [key, value] of Object.entries(theme.colors)) {
    if (!COLOR_RE.test(value)) errors.push(`colors.${key} = "${value}"`)
  }
  theme.tokenColors.forEach((rule, i) => {
    const { foreground, fontStyle } = rule.settings
    const label = `tokenColors[${i}] (${JSON.stringify(rule.scope)})`
    if (foreground !== undefined && !COLOR_RE.test(foreground)) {
      errors.push(`${label} foreground = "${foreground}"`)
    }
    if (fontStyle !== undefined && !FONT_STYLE_RE.test(fontStyle)) {
      errors.push(`${label} fontStyle = "${fontStyle}"`)
    }
  })
  if (errors.length > 0) {
    throw new Error(`${name}: invalid values\n  ${errors.join('\n  ')}`)
  }
}

for (const { dir, themes } of families) {
  const base = path.join(import.meta.dirname, dir)
  const globals = readJson(path.join(base, 'globals.json'))
  const template = fs.readFileSync(path.join(base, 'template.json'), 'utf8')

  for (const themeName of themes) {
    const variant = readJson(path.join(base, `${themeName}.json`))
    const rendered = mustache.render(template, { ...variant, ...globals })
    // JSON.parse fails loudly if the template renders to broken JSON.
    const theme = JSON.parse(rendered)
    validate(theme, themeName)
    fs.writeFileSync(
      path.join(outDir, `${themeName}.json`),
      // Compact output; oxfmt (run after) formats it consistently.
      JSON.stringify(theme),
    )
    console.log(`built themes/${themeName}.json`)
  }
}
