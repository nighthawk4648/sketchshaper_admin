import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useGetMemberStatsQuery } from "@/store/api/app/Members/membersApiSlice";
import { formatMoney } from "@/utils/money";

const TIER_COLORS = ["bg-[#FF424D]", "bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-slate-400"];

const Stat = ({ label, value, note, icon, tone }) => (
  <Card noborder className={`shadow-md border ${tone}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</h3>
        {note && <p className="text-[11px] text-slate-500 mt-1">{note}</p>}
      </div>
      <Icon icon={icon} className="text-3xl text-slate-400" />
    </div>
  </Card>
);

// Numbers counted on the server. Patreon figures come from each connected account's last check, not live from Patreon.
const PatreonDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetMemberStatsQuery();
  const stats = data?.data;

  if (isLoading) return <p className="py-24 text-center text-sm text-slate-500">Loading numbers...</p>;
  if (isError || !stats) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-xl mx-auto my-12">
        <h3 className="text-lg font-bold text-red-600">Could not load the dashboard</h3>
        <p className="text-xs text-slate-500 mt-1">{error?.data?.message || "Please check your connection or log in again."}</p>
      </div>
    );
  }

  const { accounts, signInMethods, patreon } = stats;
  const pct = (n) => (patreon.activePatrons > 0 ? Math.round((n / patreon.activePatrons) * 100) : 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-[#FF424D]">
            <Icon icon="simple-icons:patreon" className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Members & Patreon</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Website accounts and the Patreon accounts connected to them.
            </p>
          </div>
        </div>
        <Button text="Open Members" icon="heroicons:user-group" className="btn-primary btn-sm" onClick={() => navigate("/admin/members")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Stat
          label="Accounts"
          value={accounts.total}
          note={`${accounts.confirmed} with a confirmed email`}
          icon="heroicons:users"
          tone="border-blue-500/20"
        />
        <Stat
          label="PRO now"
          value={accounts.pro}
          note={`${accounts.manualPro} set by hand · ${accounts.adFree ?? 0} ad-free only · ${accounts.free} free`}
          icon="heroicons:check-badge"
          tone="border-emerald-500/20"
        />
        <Stat
          label="Active patrons"
          value={patreon.activePatrons}
          note={`of ${patreon.connected} connected Patreon accounts`}
          icon="simple-icons:patreon"
          tone="border-red-500/20"
        />
        <Stat
          label="Est. monthly pledges"
          value={formatMoney(patreon.estMonthlyCents, "USD")}
          note="From saved pledges, before Patreon fees"
          icon="heroicons:currency-dollar"
          tone="border-purple-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Active patrons by tier" className="lg:col-span-2 shadow-lg">
          {patreon.tiers.length === 0 ? (
            <p className="text-sm text-slate-500">No active patrons among connected accounts yet.</p>
          ) : (
            <div className="space-y-5">
              {patreon.tiers.map((t, i) => (
                <div key={t.name || "none"}>
                  <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300">{t.name || "Tier not known"}</span>
                    <span className="text-slate-900 dark:text-white">
                      {t.count} <span className="text-xs font-normal text-slate-400">({pct(t.count)}%) · {formatMoney(t.pledgeCents, "USD")}/mo</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`${TIER_COLORS[i % TIER_COLORS.length]} h-full rounded-full`} style={{ width: `${pct(t.count)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="How members sign in" className="shadow-lg">
          <div className="text-sm">
            {[
              ["Email and password", signInMethods.email],
              ["Google", signInMethods.google],
              ["Patreon", signInMethods.patreon],
              ["Blocked accounts", accounts.blocked],
            ].map(([label, n]) => (
              <div key={label} className="flex justify-between py-2.5 border-b last:border-0 border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{label}</span>
                <span className="font-bold text-slate-800 dark:text-white">{n}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            One account can use several ways to sign in. Patrons who never connected their Patreon to the website are not counted here; Patreon's own dashboard has the full list.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PatreonDashboard;
