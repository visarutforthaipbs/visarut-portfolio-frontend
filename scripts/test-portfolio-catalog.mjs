import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.createSourceFile("wordpress.ts", readFileSync("src/lib/wordpress.ts", "utf8"), ts.ScriptTarget.Latest, true);
const api = source.statements.find(node => ts.isClassDeclaration(node) && node.name?.text === "WordPressAPI");
const method = api.members.find(node => node.name?.getText(source) === "getAllPortfolios");
const compiled = ts.transpileModule(`class API { ${method.getText(source)} }; API`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const API = vm.runInNewContext(compiled);
const calls = [];
API.getPortfolios = async ({ page }, signal) => {
  calls.push(page);
  signal?.throwIfAborted();
  return { items: [{ id: page }], total: 3, totalPages: 3, currentPage: page };
};
const complete = await API.getAllPortfolios();
assert.deepEqual(calls, [1, 2, 3]);
assert.equal(complete.items.length, 3);
assert.equal(complete.total, 3);

API.getPortfolios = async () => ({ items: [], total: 0, totalPages: 0, currentPage: 1 });
assert.equal((await API.getAllPortfolios()).items.length, 0);

API.getPortfolios = async ({ page }) => {
  if (page === 2) throw new Error("page unavailable");
  return { items: [{ id: 1 }], totalPages: 2 };
};
await assert.rejects(API.getAllPortfolios(), /page unavailable/);

const controller = new AbortController();
let requested = 0;
API.getPortfolios = async () => {
  requested++;
  controller.abort();
  return { items: [{ id: 1 }], totalPages: 3 };
};
await assert.rejects(API.getAllPortfolios(controller.signal));
assert.equal(requested, 1);

const organizationSource = ts.transpileModule(readFileSync("src/lib/portfolioOrganization.ts", "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
vm.runInNewContext(organizationSource, {
  exports,
  require: () => ({ WordPressAPI: { normalizePortfolio: item => ({ meta: { clientName: item.acf?.client_name } }) } }),
});
const match = exports.matchOrganization;
assert.equal(match({ title: "International foundation", acf: {} }, "nation"), false);
assert.equal(match({ title: "The Nation", acf: {} }, "nation"), true);
assert.equal(match({ title: "Project", acf: { project_description: "Greenpeace campaign" } }, "greenpeace"), true);
assert.equal(match({ title: "Project", acf: { website_url: "https://example.test/greenpeace" } }, "greenpeace"), false);
console.log("PASS: full pagination, empty result, failed page, cancellation, organization aliases and URL exclusion");
