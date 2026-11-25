import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { toMemberRow } from "./memberExport.js";

describe("toMemberRow", () => {
  it("describes a Patreon PRO member", () => {
    const row = toMemberRow({
      name: "Ann",
      email: "ann@x.com",
      emailVerified: true,
      signInMethods: ["google", "patreon"],
      proSource: "patreon",
      patreon: { tier: "Gold", lastVerifiedAt: "2026-11-20T10:00:00.000Z" },
      createdAt: "2026-01-05T00:00:00.000Z",
    });
    assert.equal(row.Access, "PRO");
    assert.equal(row["Access Source"], "Patreon");
    assert.equal(row["Signs In With"], "Google, Patreon");
    assert.equal(row.Tier, "Gold");
    assert.equal(row["Patreon Last Checked"], "2026-11-20");
    assert.equal(row["Account Created"], "2026-01-05");
  });

  it("describes a manual PRO member with an end date", () => {
    const row = toMemberRow({ email: "b@x.com", signInMethods: ["email"], proSource: "manual", accessTier: "Gift", accessUntil: "2027-02-01T00:00:00.000Z" });
    assert.equal(row.Access, "PRO");
    assert.equal(row["Access Source"], "Manual");
    assert.equal(row.Tier, "Gift");
    assert.equal(row["Access Until"], "2027-02-01");
  });

  it("marks blocked and free members and leaves missing values empty", () => {
    assert.equal(toMemberRow({ email: "c@x.com", proSource: "blocked" }).Access, "Blocked");
    const free = toMemberRow({ email: "d@x.com", proSource: null });
    assert.equal(free.Access, "Free");
    assert.equal(free.Name, "");
    assert.equal(free["Email Verified"], "No");
    assert.equal(free["Account Created"], "");
  });
});

it("Early Access members export as Ad-free, PRO tiers as PRO", () => {
  const early = toMemberRow({ email: "e@x.com", proSource: "patreon", isPro: false, adFree: true, patreon: { tier: "Early Access" } });
  assert.equal(early.Access, "Ad-free");
  assert.equal(early.Tier, "Early Access");
  assert.equal(toMemberRow({ email: "p@x.com", proSource: "patreon", isPro: true, adFree: true }).Access, "PRO");
  assert.equal(toMemberRow({ email: "f@x.com", proSource: null, isPro: false, adFree: false }).Access, "Free");
  assert.equal(toMemberRow({ email: "b@x.com", proSource: "blocked", isPro: false }).Access, "Blocked");
});

it("Polar members export with their plan, and an end date only once cancelled", () => {
  const pro = toMemberRow({ email: "g@x.com", proSource: "polar", isPro: true, adFree: true, polar: { plan: "pro", period: "monthly", status: "active", renewsAt: "2026-12-24T00:00:00.000Z", cancelsAtPeriodEnd: false } });
  assert.deepEqual([pro.Access, pro["Access Source"], pro.Tier, pro["Access Until"]], ["PRO", "Polar", "Sketch shaper PRO", ""]);
  const early = toMemberRow({ email: "h@x.com", proSource: "polar", isPro: false, adFree: true, polar: { plan: "early_access", status: "active", renewsAt: "2026-12-24T00:00:00.000Z", cancelsAtPeriodEnd: true } });
  assert.deepEqual([early.Access, early.Tier, early["Access Until"]], ["Ad-free", "Early Access", "2026-12-24"]);
});
