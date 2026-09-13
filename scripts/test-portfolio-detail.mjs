import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const exports = {};
const source = ts.transpileModule(readFileSync("src/lib/portfolioDetailContent.ts", "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
vm.runInNewContext(source, { exports, require: createRequire(import.meta.url), URL });
const prepare = exports.preparePortfolioDetail;
const item = {
  content: { rendered: '<p>A &amp; B</p><img src="https://example.test/photo-300x200.jpg"><iframe src="https://www.youtube.com/embed/example"></iframe>' },
  excerpt: { rendered: "Short preview" },
  featured_image: { url: "https://example.test/photo.jpg" },
  acf: { project_description: "A & B", design_concept: "Distinct notes" },
  media: [
    { type: "image", url: "https://example.test/photo-1024x683.jpg" },
    { type: "image", url: "https://example.test/extra.jpg" },
    { type: "image", url: "https://example.test/extra-300x200.jpg" },
  ],
};
for (const category of ["photography", "videography", "video-editing", "website", "graphic-design", "print", "exhibition", "campaign", "producer"]) {
  const result = prepare({ ...item, category });
  assert.equal(result.body, item.content.rendered);
  assert.equal(result.showFeatured, false);
  assert.equal(result.details.acf.project_description, undefined);
  assert.equal(result.details.acf.design_concept, "Distinct notes");
  assert.equal(result.gallery.featured_image, undefined);
  assert.equal(result.gallery.media.length, 1);
  assert.equal(result.gallery.media[0].url, "https://example.test/extra.jpg");
}
assert.equal(item.acf.project_description, "A & B");
assert.equal(prepare({ ...item, content: { rendered: "<p> </p>" } }).body, "Short preview");
assert.equal(prepare({ ...item, content: { rendered: '<iframe src="https://www.youtube.com/embed/example"></iframe>' } }).body.includes("iframe"), true);
console.log("PASS: all nine categories preserve the article, exclude repeated images and descriptions, retain distinct notes, and fall back to excerpts.");
