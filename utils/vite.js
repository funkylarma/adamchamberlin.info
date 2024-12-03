import fs from "fs/promises";
import path from "path";
import memoize from "lodash/memoize.js";

const DEFAULT_ENTRY_FILE = "src/assets/js/main.js";
const PATH_PREFIX = "/";

const getAssetManifest = memoize(async function () {
  const manifest = await fs.readFile(
    path.resolve(process.cwd(), "_site/.vite", "manifest.json")
  );
  return JSON.parse(manifest);
});

async function getChunkInformationFor(entryFilename) {
  // We want an entryFilename, because in practice you might have multiple entrypoints
  // This is similar to how you specify an entry in development more
  if (!entryFilename) {
    throw new Error(
      "You must specify an entryFilename, so that vite-script can find the correct file."
    );
  }

  const manifest = await getAssetManifest();
  const entryChunk = manifest[entryFilename];

  if (!entryChunk) {
    const possibleEntries = Object.values(manifest)
      .filter((chunk) => chunk.isEntry === true)
      .map((chunk) => `"${chunk.src}"`)
      .join(`, `);
    throw new Error(
      `No entry for ${entryFilename} found in _site/.vite/manifest.json. Valid entries in manifest: ${possibleEntries}`
    );
  }

  return entryChunk;
}

async function viteScriptTag(entryFilename) {
  const entryFile = entryFilename || DEFAULT_ENTRY_FILE;
  const entryChunk = await getChunkInformationFor(entryFile);
  return `<script async type="module" src="${PATH_PREFIX}${entryChunk.file}"></script>`;
}

async function viteLinkStylesheetTags(entryFilename) {
  const entryFile = entryFilename || DEFAULT_ENTRY_FILE;
  const entryChunk = await getChunkInformationFor(entryFile);
  if (!entryChunk.css || entryChunk.css.length === 0) {
    console.warn(`No css found for ${entryFilename} entry. Is that correct?`);
    return "";
  }
  /* There can be multiple CSS files per entry, so assume many by default */
  return entryChunk.css
    .map(
      (cssFile) =>
        `<link rel="stylesheet" href="${PATH_PREFIX}${cssFile}" media="all" onload="this.media='all'" fetchpriority="low">`
    )
    .join("\n");
}

async function viteLegacyScriptTag(entryFilename) {
  const entryChunk = await getChunkInformationFor(entryFilename);
  return `<script nomodule src="${PATH_PREFIX}${entryChunk.file}"></script>`;
}

export default {
  viteScriptTag,
  viteLinkStylesheetTags,
  viteLegacyScriptTag,
};
