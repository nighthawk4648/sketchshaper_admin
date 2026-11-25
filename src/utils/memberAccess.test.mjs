import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { accessKey, planName, polarDetail } from "./memberAccess.js";

const fmt = (iso) => iso.slice(0, 10);

describe("accessKey", () => {
  it("picks the badge from the source, and marks plans that only remove ads", () => {
    assert.equal(accessKey({ proSource: "polar", isPro: true, adFree: true }), "polar");
    assert.equal(accessKey({ proSource: "polar", isPro: false, adFree: true }), "adfree_polar");
    assert.equal(accessKey({ proSource: "patreon" }), "patreon");
    assert.equal(accessKey({ proSource: null }), "free");
  });
});

describe("polarDetail", () => {
  const polar = { plan: "pro", period: "yearly", status: "active", renewsAt: "2026-12-24T18:00:00Z", cancelsAtPeriodEnd: false };
  it("says when the plan renews, ends or ended", () => {
    assert.equal(polarDetail(polar, fmt), "Sketch shaper PRO · yearly · renews 2026-12-24");
    assert.equal(polarDetail({ ...polar, cancelsAtPeriodEnd: true }, fmt), "Sketch shaper PRO · yearly · ends 2026-12-24");
    assert.equal(polarDetail({ ...polar, status: "canceled" }, fmt), "Sketch shaper PRO · yearly · ended 2026-12-24");
  });
  it("copes with a missing date or plan", () => {
    assert.equal(polarDetail({ ...polar, renewsAt: null }, fmt), "Sketch shaper PRO · yearly");
    assert.equal(polarDetail(null, fmt), "");
    assert.equal(planName("mystery"), "mystery");
  });
});
