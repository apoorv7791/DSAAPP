#!/usr/bin/env node
/**
 * translate.mjs
 *
 * Automatically fills in missing translation keys in lib/i18n.ts.
 * Uses English as the source of truth and translates any missing
 * keys into the target language via Google Translate.
 *
 * Usage:
 *   node scripts/translate.mjs              # fill all missing keys
 *   node scripts/translate.mjs --dry-run    # preview without writing
 *   node scripts/translate.mjs --lang hi    # only one language
 *   node scripts/translate.mjs --force      # re-translate ALL keys
 */

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { translate } from '@vitalets/google-translate-api';

// ─── Config ────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_PATH = resolve(__dirname, '../lib/i18n.ts');

/** Map app language codes → Google Translate language codes */
const LANG_CODES = {
  en: 'en',
  hi: 'hi',
  es: 'es',
  fr: 'fr',
  de: 'de',
  zh: 'zh-CN',
  ja: 'ja',
  ar: 'ar',
};

const TARGET_LANGS = Object.keys(LANG_CODES).filter((l) => l !== 'en');

// Sentinel used to batch strings into one request
const SEP = ' ||| ';

// ─── CLI flags ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const langFlag = args.indexOf('--lang');
const ONLY_LANG = langFlag !== -1 ? args[langFlag + 1] : null;

// ─── Translation helper ─────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Translate an array of strings using one request per batch.
 * Joins strings with a separator that is preserved by Google Translate.
 */
async function translateBatch(texts, targetLang, retries = 3) {
  if (texts.length === 0) return [];

  const to = LANG_CODES[targetLang] ?? targetLang;
  const joined = texts.join(SEP);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await translate(joined, { to, from: 'en' });
      const parts = result.text.split(SEP);

      if (parts.length === texts.length) return parts;

      // Split count mismatch — fall back to one-by-one
      console.warn(`\n    ⚠️  Batch mismatch (got ${parts.length}, expected ${texts.length}), translating one-by-one`);
      return translateOneByOne(texts, to);
    } catch (err) {
      if (attempt < retries) {
        const delay = 1500 * 2 ** attempt + Math.random() * 500;
        console.warn(`\n    ⚠️  Error: ${err.message} — retrying in ${Math.round(delay)}ms`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
}

async function translateOneByOne(texts, to) {
  const results = [];
  for (const text of texts) {
    const res = await translate(text, { to, from: 'en' });
    results.push(res.text);
    await sleep(400);
  }
  return results;
}

// ─── Object utilities ───────────────────────────────────────────────────────

function collectLeaves(obj, path = []) {
  const leaves = [];
  for (const [key, val] of Object.entries(obj)) {
    const p = [...path, key];
    if (Array.isArray(val)) {
      leaves.push({ path: p, value: val, isArray: true });
    } else if (val !== null && typeof val === 'object') {
      leaves.push(...collectLeaves(val, p));
    } else {
      leaves.push({ path: p, value: val, isArray: false });
    }
  }
  return leaves;
}

function getNestedValue(obj, path) {
  return path.reduce((cur, key) => (cur != null ? cur[key] : undefined), obj);
}

function setNestedValue(obj, path, value) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!cur[path[i]] || typeof cur[path[i]] !== 'object') cur[path[i]] = {};
    cur = cur[path[i]];
  }
  cur[path[path.length - 1]] = value;
}

// ─── i18n.ts parser / serializer ───────────────────────────────────────────

function extractTranslations(src) {
  const match = src.match(/export\s+const\s+translations\s*:\s*Record<[^>]+>\s*=\s*(\{)/);
  if (!match) throw new Error('Could not find `translations` export in i18n.ts');

  const startIdx = src.indexOf(match[1], match.index);
  let depth = 0, endIdx = startIdx;
  for (let i = startIdx; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
  }

  // eslint-disable-next-line no-new-func
  return { obj: new Function(`return (${src.slice(startIdx, endIdx + 1)})`)(), startIdx, endIdx };
}

function serializeTranslations(src, { startIdx, endIdx }, updated) {
  return src.slice(0, startIdx) + serializeObject(updated, 0) + src.slice(endIdx + 1);
}

function serializeObject(obj, indent) {
  const pad = '    '.repeat(indent);
  const inner = '    '.repeat(indent + 1);
  if (Array.isArray(obj)) {
    if (!obj.length) return '[]';
    return `[\n${obj.map((v) => `${inner}${serializeValue(v, indent + 1)}`).join(',\n')}\n${pad}]`;
  }
  const entries = Object.entries(obj);
  if (!entries.length) return '{}';
  const lines = entries.map(([k, v]) => {
    const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
    return `${inner}${key}: ${serializeValue(v, indent + 1)}`;
  });
  return `{\n${lines.join(',\n')},\n${pad}}`;
}

function serializeValue(val, indent) {
  if (val === null) return 'null';
  if (typeof val === 'boolean' || typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const esc = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${esc}"`;
  }
  return serializeObject(val, indent);
}

// ─── Main ───────────────────────────────────────────────────────────────────

const BATCH_SIZE = 15; // strings per request — keep low to avoid split issues

async function main() {
  console.log('📖  Reading i18n.ts…');
  const src = await readFile(I18N_PATH, 'utf8');

  console.log('🔍  Parsing translations…');
  const { obj: translations, startIdx, endIdx } = extractTranslations(src);

  const enLeaves = collectLeaves(translations.en);
  const langs = ONLY_LANG ? [ONLY_LANG] : TARGET_LANGS;

  console.log(`🌍  Target languages: ${langs.join(', ')}`);
  if (DRY_RUN) console.log('👀  DRY RUN — no files will be written\n');

  let totalTranslated = 0;

  for (const lang of langs) {
    if (!translations[lang]) {
      console.warn(`⚠️   No existing object for "${lang}" — skipping`);
      continue;
    }

    console.log(`\n── ${lang.toUpperCase()} ────────────────────────────────`);

    // Collect leaves needing translation
    const scalars = [];
    const arrays = [];
    for (const leaf of enLeaves) {
      const existing = getNestedValue(translations[lang], leaf.path);
      if (!FORCE && existing !== undefined) continue;
      if (leaf.isArray) arrays.push(leaf);
      else if (typeof leaf.value === 'string') scalars.push(leaf);
    }

    const total = scalars.length + arrays.length;
    if (total === 0) { console.log('  ✨  Already complete'); continue; }
    console.log(`  📝  ${scalars.length} strings + ${arrays.length} arrays to translate`);

    // ── Scalar batches ────────────────────────────────────────────────
    for (let i = 0; i < scalars.length; i += BATCH_SIZE) {
      const chunk = scalars.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const batchTotal = Math.ceil(scalars.length / BATCH_SIZE);

      process.stdout.write(`  🔄  Strings batch ${batchNum}/${batchTotal} (${chunk.length})… `);

      if (DRY_RUN) {
        console.log('(skipped — dry run)');
        totalTranslated += chunk.length;
        continue;
      }

      try {
        const results = await translateBatch(chunk.map((l) => l.value), lang);
        for (let j = 0; j < chunk.length; j++) {
          setNestedValue(translations[lang], chunk[j].path, results[j]);
        }
        totalTranslated += chunk.length;
        console.log('✅');
        if (i + BATCH_SIZE < scalars.length) await sleep(600);
      } catch (err) {
        console.log(`❌  ${err.message}`);
      }
    }

    // ── Arrays ────────────────────────────────────────────────────────
    for (const leaf of arrays) {
      const items = leaf.value.filter((v) => typeof v === 'string');
      if (!items.length) continue;

      process.stdout.write(`  🔄  Array ${leaf.path.at(-1)} (${items.length} items)… `);

      if (DRY_RUN) {
        console.log('(skipped — dry run)');
        totalTranslated++;
        continue;
      }

      try {
        const results = await translateBatch(items, lang);
        let ri = 0;
        const merged = leaf.value.map((v) =>
          typeof v === 'string' ? results[ri++] : v,
        );
        setNestedValue(translations[lang], leaf.path, merged);
        totalTranslated++;
        console.log('✅');
        await sleep(600);
      } catch (err) {
        console.log(`❌  ${err.message}`);
      }
    }

    console.log(`  → Finished ${lang}`);
  }

  if (totalTranslated === 0) {
    console.log('\n✨  Everything is already up to date.');
    return;
  }

  if (DRY_RUN) {
    console.log(`\n✅  Dry run complete — ${totalTranslated} key(s) would be updated.`);
    return;
  }

  console.log('\n💾  Writing i18n.ts…');
  const newSrc = serializeTranslations(src, { startIdx, endIdx }, translations);
  await writeFile(I18N_PATH, newSrc, 'utf8');
  console.log(`\n✅  Done! ${totalTranslated} key(s) translated and saved to i18n.ts`);
}

main().catch((err) => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
