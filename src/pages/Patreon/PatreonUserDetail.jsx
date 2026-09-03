import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPatreonUserByIdQuery,
  useRevokePatreonUserMutation,
} from "@/store/api/app/Patreon/patreonApiSlice";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PatreonUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetPatreonUserByIdQuery(id);
  const [revokeUser, { isLoading: isRevoking }] =
    useRevokePatreonUserMutation();

  const user = data?.data;

  const handleRevoke = () => {
    Swal.fire({
      title: "Revoke Patron Access?",
      html: `Are you sure you want to revoke active patron status for <b class="text-slate-900 dark:text-white">${user?.full_name || user?.email}</b>?<br/><span class="text-xs text-red-500">The user will lose access to paid 3D downloads until they re-authenticate.</span>`,
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
          await revokeUser(id).unwrap();
          toast.success("Patron access revoked successfully.");
        } catch (err) {
          toast.error(err?.data?.message || "Failed to revoke access.");
        }
      }
    });
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-sm text-slate-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <Card className="max-w-xl mx-auto my-12 text-center p-8">
        <Icon
          icon="heroicons:exclamation-circle"
          className="text-4xl text-red-500 mx-auto mb-3"
        />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          User Not Found
        </h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          {error?.data?.message ||
            "The requested Patreon subscriber could not be loaded."}
        </p>
        <Button
          text="Back to Subscribers"
          icon="heroicons:arrow-left"
          className="btn-dark mx-auto"
          onClick={() => navigate("/admin/patreon/users")}
        />
      </Card>
    );
  }

  const isActive = user.is_active_patron;
  const tierName = user.membership_tier
    ? user.membership_tier.charAt(0).toUpperCase() +
      user.membership_tier.slice(1)
    : "Free";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/patreon/users")}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Icon icon="heroicons:arrow-left" className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Subscriber Details
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ID: #{user.id} • Registered via Patreon OAuth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${user.email}?subject=Message%20from%20SketchShaper`}
            className="btn btn-outline-dark btn-sm flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs"
          >
            <Icon icon="heroicons:envelope" /> Email User
          </a>
          {isActive && (
            <Button
              text="Revoke Access"
              icon="heroicons:no-symbol"
              className="btn-danger btn-sm"
              disabled={isRevoking}
              onClick={handleRevoke}
            />
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="shadow-lg">
        {/* Top Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md ${
                isActive
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                  : "bg-slate-400"
              }`}
            >
              {user.full_name?.[0]?.toUpperCase() ||
                user.email?.[0]?.toUpperCase() ||
                "?"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.full_name || "Anonymous Patron"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                Active Patron
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>{" "}
                Inactive Access
              </span>
            )}
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
              💎 {tierName} Tier
            </span>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account & Patreon Info */}
          <div className="space-y-4 p-5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-900/40">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Icon icon="heroicons:identification" /> Patreon Profile Info
            </h4>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Full Name
              </span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {user.full_name || "—"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Email Address
              </span>
              <button
                onClick={() => copyToClipboard(user.email, "Email")}
                className="font-semibold text-primary-500 hover:underline flex items-center gap-1"
              >
                {user.email}{" "}
                <Icon icon="heroicons:document-duplicate" className="text-xs" />
              </button>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Patreon User ID
              </span>
              <button
                onClick={() => copyToClipboard(user.patreon_id, "Patreon ID")}
                className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1"
              >
                {user.patreon_id}{" "}
                <Icon icon="heroicons:document-duplicate" className="text-xs" />
              </button>
            </div>

            <div className="flex justify-between items-center py-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Monthly Pledge
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                $
                {(user.pledge_amount_cents
                  ? user.pledge_amount_cents / 100
                  : 0
                ).toFixed(2)}
                /mo
              </span>
            </div>
          </div>

          {/* Timeline & Verification */}
          <div className="space-y-4 p-5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-900/40">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Icon icon="heroicons:clock" /> Activity & Timeline
            </h4>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Initial Registration
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Last Verified by Patreon
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {user.last_verified_at
                  ? new Date(user.last_verified_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Download Eligibility
              </span>
              <span
                className={`font-semibold text-xs px-2.5 py-1 rounded-full ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {isActive
                  ? "✅ Eligible for Pro Downloads"
                  : "❌ Subscription Inactive"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PatreonUserDetail;
