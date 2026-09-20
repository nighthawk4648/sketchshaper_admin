import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { usePatreon } from "@/hooks/usePatreon";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PatreonUsers = () => {
  const navigate = useNavigate();
  const {
    users,
    pagination,
    isLoading,
    isError,
    error,
    isFetching,
    isRevoking,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    revokeUser,
  } = usePatreon();

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  // Handle Revoke Confirmation
  const handleRevoke = (user) => {
    Swal.fire({
      title: "Revoke Patron Access?",
      html: `Are you sure you want to revoke active patron status for <b class="text-slate-900 dark:text-white">${user.full_name || user.email}</b>?<br/><span class="text-xs text-red-500">The user will lose access to paid 3D downloads until they re-authenticate.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Revoke Access",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup:
          "dark:bg-slate-800 dark:text-white rounded-xl shadow-2xl border dark:border-slate-700",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await revokeUser(user.id).unwrap();
          toast.success(
            `Patron access revoked for ${user.full_name || user.email}`,
          );
        } catch (err) {
          toast.error(err?.data?.message || "Failed to revoke access.");
        }
      }
    });
  };

  // Format readable dates
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card noborder className="shadow-lg">
        {/* Header & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Icon icon="heroicons:user-group" className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Patreon Subscribers
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  View and manage all Patreon accounts connected to
                  SketchShaper.
                </p>
              </div>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="form-control py-2 pl-9 text-sm rounded-lg border-slate-200 dark:border-slate-700"
              />
              <Icon
                icon="heroicons:magnifying-glass"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <Icon icon="heroicons:x-mark" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {[
                { key: "", label: "All" },
                { key: "active", label: "Active Patrons" },
                { key: "inactive", label: "Inactive" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatus(tab.key);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    status === tab.key
                      ? "bg-white dark:bg-slate-700 text-primary-500 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Back to Dashboard Button */}
            <button
              onClick={() => navigate("/admin/patreon")}
              className="btn btn-outline-dark btn-sm flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs"
            >
              <Icon icon="heroicons:chart-bar" /> Dashboard
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mb-3"></div>
            <p className="text-sm text-slate-500">Loading Patreon users...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-8 text-center bg-red-500/10 rounded-xl my-6 border border-red-500/20">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="text-3xl text-red-500 mx-auto mb-2"
            />
            <p className="font-semibold text-red-600">
              Failed to load Patreon users
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {error?.data?.message ||
                "Please check your connection or log in again."}
            </p>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40">
                    <th className="py-3.5 px-4 rounded-l-lg">Subscriber</th>
                    <th className="py-3.5 px-4">Membership Tier</th>
                    <th className="py-3.5 px-4">Monthly Pledge</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4 text-right rounded-r-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {users.map((user) => {
                    const isActive = user.is_active_patron;
                    const tierName = user.membership_tier
                      ? user.membership_tier.charAt(0).toUpperCase() +
                        user.membership_tier.slice(1)
                      : "Free";

                    return (
                      <tr
                        key={user.id}
                        onClick={() =>
                          navigate(`/admin/patreon/users/${user.id}`)
                        }
                        className="group transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        {/* User Info */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                                isActive
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                              }`}
                            >
                              {user.full_name?.[0]?.toUpperCase() ||
                                user.email?.[0]?.toUpperCase() ||
                                "?"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {user.full_name || "Anonymous Patron"}
                              </p>
                              <a
                                href={`mailto:${user.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <Icon
                                  icon="heroicons:envelope"
                                  className="text-xs"
                                />
                                {user.email}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Membership Tier */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              user.membership_tier === "premium"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                : user.membership_tier === "standard"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            💎 {tierName}
                          </span>
                        </td>

                        {/* Pledge Amount */}
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-200">
                          $
                          {(user.pledge_amount_cents
                            ? user.pledge_amount_cents / 100
                            : 0
                          ).toFixed(2)}
                          <span className="text-xs font-normal text-slate-400">
                            /mo
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                              Active Patron
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{" "}
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(user.created_at)}
                        </td>

                        {/* Actions */}
                        <td
                          className="py-4 px-4 whitespace-nowrap text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Details Button */}
                            <Tooltip content="View Details" placement="top">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/admin/patreon/users/${user.id}`)
                                }
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                              >
                                <Icon
                                  icon="heroicons:eye"
                                  className="text-lg"
                                />
                              </button>
                            </Tooltip>

                            {/* Revoke Access Button */}
                            {isActive && (
                              <Tooltip content="Revoke Access" placement="top">
                                <button
                                  type="button"
                                  disabled={isRevoking}
                                  onClick={() => handleRevoke(user)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                >
                                  <Icon
                                    icon="heroicons:no-symbol"
                                    className="text-lg"
                                  />
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {users.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-2xl mb-3">
                    <Icon icon="heroicons:user-group" />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    No Patreon users found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {search
                      ? "Try changing your search keywords."
                      : "No subscribers matching this filter."}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-800 dark:text-white">
                  {users.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800 dark:text-white">
                  {totalItems}
                </span>{" "}
                subscriber(s)
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1 || isFetching}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="btn btn-sm btn-outline-dark disabled:opacity-50 py-1 px-3 text-xs flex items-center gap-1 rounded-lg"
                  >
                    <Icon icon="heroicons:chevron-left" /> Previous
                  </button>
                  <span className="text-xs font-semibold px-2 text-slate-600 dark:text-slate-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn btn-sm btn-outline-dark disabled:opacity-50 py-1 px-3 text-xs flex items-center gap-1 rounded-lg"
                  >
                    Next <Icon icon="heroicons:chevron-right" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PatreonUsers;
