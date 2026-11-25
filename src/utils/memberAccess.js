const PLAN_NAMES = { early_access: "Early Access", pro: "Sketch shaper PRO", sponsor: "Sponsor" };
export const planName = (id) => PLAN_NAMES[id] || id || "";

const LIVE = ["active", "trialing"];

// Which badge a member gets: their access source, or adfree_<source> for a plan that only removes ads
export function accessKey(member) {
  const adFreeOnly = member.proSource && member.isPro === false && member.adFree;
  return adFreeOnly ? `adfree_${member.proSource}` : member.proSource || "free";
}

// "Sketch shaper PRO · monthly · renews Dec 24, 2026"; "ends" once cancelled, "ended" once the plan is over.
// `format` turns a date into text (the Members pages pass their own).
export function polarDetail(polar, format) {
  if (!polar) return "";
  const when = !polar.renewsAt
    ? ""
    : ` · ${!LIVE.includes(polar.status) ? "ended" : polar.cancelsAtPeriodEnd ? "ends" : "renews"} ${format(polar.renewsAt)}`;
  return `${planName(polar.plan)} · ${polar.period}${when}`;
}
