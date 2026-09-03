import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { usePatreon } from "@/hooks/usePatreon";
import { useNavigate } from "react-router-dom";

const PatreonDashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading, isError, error } = usePatreon({
    initialPage: 1,
    initialLimit: 1000,
  });

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-xl mx-auto my-12">
        <Icon
          icon="heroicons:exclamation-triangle"
          className="text-4xl text-red-500 mx-auto mb-3"
        />
        <h3 className="text-lg font-bold text-red-600">
          Error Loading Patreon Dashboard
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {error?.data?.message || "Failed to load subscriber analytics."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-sm text-slate-500">
            Calculating Patreon metrics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Icon icon="heroicons:heart" className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Patreon Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live overview of active memberships, monthly revenue, and tier
              breakdown.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            text="Manage Subscribers"
            icon="heroicons:user-group"
            className="btn-primary btn-sm"
            onClick={() => navigate("/admin/patreon/users")}
          />
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Patrons */}
        <Card
          noborder
          className="shadow-md bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Active Patrons
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {stats.activePatrons}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active paying subscribers
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-2xl">
              <Icon icon="heroicons:check-badge" />
            </div>
          </div>
        </Card>

        {/* Monthly Revenue */}
        <Card
          noborder
          className="shadow-md bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Est. Monthly Revenue
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                ${(stats.totalRevenue / 100).toFixed(2)}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Avg. ${(stats.averagePledge / 100).toFixed(2)} / active patron
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 text-2xl">
              <Icon icon="heroicons:currency-dollar" />
            </div>
          </div>
        </Card>

        {/* Total Accounts */}
        <Card
          noborder
          className="shadow-md bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Total Registered
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {stats.totalUsers}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Connected Patreon accounts
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 text-2xl">
              <Icon icon="heroicons:users" />
            </div>
          </div>
        </Card>

        {/* Inactive Patrons */}
        <Card
          noborder
          className="shadow-md bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-transparent border border-slate-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Inactive / Free
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {stats.inactivePatrons}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                {stats.conversionRate.toFixed(1)}% active conversion rate
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-500/20 text-slate-600 dark:text-slate-400 text-2xl">
              <Icon icon="heroicons:user-minus" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tier Breakdown & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Tier Distribution */}
        <Card noborder className="lg:col-span-2 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Active Tier Distribution
              </h4>
              <p className="text-xs text-slate-500">
                Breakdown of paying subscribers across membership tiers.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              💎 {stats.activePatrons} Active
            </span>
          </div>

          <div className="space-y-5">
            {/* Basic Tier */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">
                  Basic Tier
                </span>
                <span className="text-slate-900 dark:text-white">
                  {stats.tierBreakdown.basic}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (
                    {stats.activePatrons > 0
                      ? (
                          (stats.tierBreakdown.basic / stats.activePatrons) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.activePatrons > 0 ? (stats.tierBreakdown.basic / stats.activePatrons) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Standard Tier */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">
                  Standard Tier
                </span>
                <span className="text-slate-900 dark:text-white">
                  {stats.tierBreakdown.standard}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (
                    {stats.activePatrons > 0
                      ? (
                          (stats.tierBreakdown.standard / stats.activePatrons) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.activePatrons > 0 ? (stats.tierBreakdown.standard / stats.activePatrons) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Premium Tier */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">
                  Premium Tier
                </span>
                <span className="text-slate-900 dark:text-white">
                  {stats.tierBreakdown.premium}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (
                    {stats.activePatrons > 0
                      ? (
                          (stats.tierBreakdown.premium / stats.activePatrons) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.activePatrons > 0 ? (stats.tierBreakdown.premium / stats.activePatrons) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Insights */}
        <Card noborder className="shadow-lg flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Subscriber Summary
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Key conversion and average pledge insights.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  Active Rate
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.conversionRate.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  Avg. Active Pledge
                </span>
                <span className="font-bold text-slate-800 dark:text-white">
                  ${(stats.averagePledge / 100).toFixed(2)}/mo
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Patreon Integration
                </span>
                <span className="font-semibold text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  ● Connected
                </span>
              </div>
            </div>
          </div>

          <Button
            text="View All Subscribers"
            icon="heroicons:arrow-right"
            className="btn-outline-dark btn-sm w-full mt-6"
            onClick={() => navigate("/admin/patreon/users")}
          />
        </Card>
      </div>
    </div>
  );
};

export default PatreonDashboard;
