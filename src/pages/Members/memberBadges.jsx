import Icon from "@/components/ui/Icon";

export const formatDate = (iso, withTime = false) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(withTime && { hour: "2-digit", minute: "2-digit" }),
      })
    : "—";

const METHODS = {
  email: { label: "Email", icon: "heroicons:envelope", className: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200" },
  google: { label: "Google", icon: "logos:google-icon", className: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  patreon: { label: "Patreon", icon: "simple-icons:patreon", className: "bg-red-50 text-[#FF424D] dark:bg-red-900/20" },
};

export const SignInBadges = ({ methods = [] }) => (
  <div className="flex flex-wrap gap-1">
    {methods.length === 0 && <span className="text-xs text-slate-400">—</span>}
    {methods.map((m) => (
      <span key={m} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${METHODS[m]?.className}`}>
        <Icon icon={METHODS[m]?.icon} className="text-xs" />
        {METHODS[m]?.label || m}
      </span>
    ))}
  </div>
);

const ACCESS_STYLES = {
  patreon: { label: "PRO · Patreon", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  manual: { label: "PRO · Manual", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  adfree_patreon: { label: "Ad-free · Patreon", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  adfree_manual: { label: "Ad-free · Manual", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  blocked: { label: "Blocked", className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
  free: { label: "Free", className: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20" },
};

export const AccessBadge = ({ member }) => {
  // A paying tier without PRO models (Early Access) gets its own badge
  const adFreeOnly = member.proSource && member.isPro === false && member.adFree;
  const style = ACCESS_STYLES[adFreeOnly ? `adfree_${member.proSource}` : member.proSource || "free"];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style.className}`}>
      {style.label}
    </span>
  );
};

export const AccessDetail = ({ member }) => {
  if (member.proSource === "manual") {
    const end = member.accessUntil ? `until ${formatDate(member.accessUntil)}` : "no end date";
    return <span>{member.accessTier ? `${member.accessTier} · ${end}` : end}</span>;
  }
  if (member.manualExpired) return <span className="text-amber-600">manual PRO ended {formatDate(member.accessUntil)}</span>;
  if (member.proSource === "patreon" && member.patreon?.tier) return <span>{member.patreon.tier}</span>;
  return null;
};
