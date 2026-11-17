import { it } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml } from "./escapeHtml.js";

it("turns a name with markup into harmless text", () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert(1)">Tom & 'Jo'`),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;Tom &amp; &#39;Jo&#39;",
  );
});

it("leaves ordinary names alone and copes with missing values", () => {
  assert.equal(escapeHtml("Jane Doe"), "Jane Doe");
  assert.equal(escapeHtml(undefined), "");
  assert.equal(escapeHtml(null), "");
});
