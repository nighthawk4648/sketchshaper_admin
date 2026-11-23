const METHOD_LABELS = { email: "Email", google: "Google", patreon: "Patreon" };
const SOURCE_LABELS = { patreon: "Patreon", manual: "Manual" };

const day = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

// PRO, a paying tier that only removes ads (Early Access), Blocked or Free; an answer without isPro counts as PRO
const accessLabel = (m) => {
  if (m.proSource === "blocked") return "Blocked";
  if (!m.proSource) return "Free";
  return m.isPro === false && m.adFree ? "Ad-free" : "PRO";
};

// One spreadsheet row per member, same facts as the Members table
export const toMemberRow = (m) => ({
  "Name": m.name || "",
  "Email": m.email,
  "Email Verified": m.emailVerified ? "Yes" : "No",
  "Signs In With": (m.signInMethods || []).map((s) => METHOD_LABELS[s] || s).join(", "),
  "Access": accessLabel(m),
  "Access Source": SOURCE_LABELS[m.proSource] || "",
  "Tier": (m.proSource === "manual" ? m.accessTier : m.patreon?.tier) || "",
  "Access Until": m.proSource === "manual" ? day(m.accessUntil) : "",
  "Patreon Last Checked": day(m.patreon?.lastVerifiedAt),
  "Account Created": day(m.createdAt),
});
