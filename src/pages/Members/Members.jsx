import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ExportMenu from "@/components/shared/CustomTable/ExportMenu";
import { useGetMembersQuery } from "@/store/api/app/Members/membersApiSlice";
import { exportToExcel, exportToCsv } from "@/utils/exportToExcel";
import { toMemberRow } from "@/utils/memberExport";
import { AccessBadge, AccessDetail, SignInBadges, formatDate } from "./memberBadges";

const ALL = 10000; // the server accepts up to this many rows per request
const FILTERS = [
  { key: "all", label: "All" },
  { key: "pro", label: "PRO" },
  { key: "adfree", label: "Ad-free" },
  { key: "free", label: "Free" },
  { key: "patreon", label: "Patreon connected" },
  { key: "polar", label: "Polar" },
  { key: "manual", label: "Set by hand" },
  { key: "blocked", label: "Blocked" },
];

const Members = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(20); // 20, 50, 100 or ALL
  const { data, isLoading, isError, error, isFetching } = useGetMembersQuery({ page, search, filter, limit });

  const members = data?.data?.result || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const total = data?.data?.pagination?.total || 0;
  const open = (id) => navigate(`/admin/members/${id}`);

  // Exports what the list shows: this page for 20/50/100, everyone for View All
  const handleExport = (format) => {
    if (!members.length) {
      toast.info("No members to export");
      return;
    }
    const fileName = `Members_${filter}_${limit === ALL ? "all" : `page${page}`}_${new Date().toISOString().slice(0, 10)}`;
    (format === "csv" ? exportToCsv : exportToExcel)(members.map(toMemberRow), fileName);
  };

  return (
    <Card noborder className="shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500">
            <Icon icon="heroicons:user-group" className="text-2xl" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Members</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Every website account. Open one to make it PRO, Free or Blocked.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-control py-2 pl-9 text-sm rounded-lg"
            />
            <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <ExportMenu onExport={handleExport} disabled={isFetching} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-4 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filter === f.key
                ? "bg-white dark:bg-slate-700 text-primary-500 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="py-16 text-center text-sm text-slate-500">Loading members...</p>}

      {isError && (
        <div className="p-6 text-center bg-red-500/10 rounded-xl my-6 border border-red-500/20">
          <p className="font-semibold text-red-600">Failed to load members</p>
          <p className="text-xs text-slate-500 mt-1">{error?.data?.message || "Please check your connection or log in again."}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Signs in with</th>
                  <th className="py-3 px-4">Access</th>
                  <th className="py-3 px-4">Patreon last checked</th>
                  <th className="py-3 px-4">Account created</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-100 dark:divide-slate-700/60 ${isFetching ? "opacity-60" : ""}`}>
                {members.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => open(m.id)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.name || "—"}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        {m.email}
                        {!m.emailVerified && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 rounded">unconfirmed</span>
                        )}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <SignInBadges methods={m.signInMethods} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <AccessBadge member={m} />
                      <div className="text-[11px] text-slate-500 mt-1">
                        <AccessDetail member={m} />
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500">
                      {m.patreon ? formatDate(m.patreon.lastVerifiedAt, true) : "—"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500">{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {members.length === 0 && (
              <p className="py-14 text-center text-sm text-slate-500">
                {search ? "No members match this search." : "No members in this filter."}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 mt-2 border-t border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <select
                className="form-control py-2 w-max text-sm"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    Show {n}
                  </option>
                ))}
                <option value={ALL}>View All</option>
              </select>
              <p className="text-xs text-slate-500">
                Showing <b>{members.length}</b> of <b>{total}</b> member(s)
              </p>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="btn btn-sm btn-outline-dark disabled:opacity-50 py-1 px-3 text-xs rounded-lg"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn btn-sm btn-outline-dark disabled:opacity-50 py-1 px-3 text-xs rounded-lg"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default Members;
