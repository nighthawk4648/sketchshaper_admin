import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { escapeHtml } from "@/utils/escapeHtml";
import { useGetMemberQuery, useSetMemberAccessMutation } from "@/store/api/app/Members/membersApiSlice";
import { formatMoney } from "@/utils/money";
import { AccessBadge, AccessDetail, SignInBadges, formatDate } from "./memberBadges";
import PaymentsCard from "./PaymentsCard";

// The paid tiers on Patreon (same names, so manual and Patreon members line up). Early Access only removes ads;
// the others give PRO models too (the server decides this by tier name, see pro.service.mjs AD_FREE_TIERS).
const TIERS = ["Early Access", "Sketch shaper-Pro", "Sponsor"];
const AD_FREE_ONLY = "Early Access";

const OPTIONS = [
  { access: "normal", label: "Normal" },
  ...TIERS.map((tier) => ({ access: "pro", tier, label: tier === AD_FREE_ONLY ? `${tier} (ad-free only)` : tier })),
  { access: "blocked", label: "Blocked" },
];

// yyyy-mm-dd for the date field, and back to the end of that day
const toDateInput = (iso) => (iso ? new Date(iso).toLocaleDateString("en-CA") : "");
const fromDateInput = (value) => (value ? new Date(`${value}T23:59:59`).toISOString() : null);
const tomorrow = () => new Date(Date.now() + 86400_000).toLocaleDateString("en-CA");

const Row = ({ label, children }) => (
  <div className="flex justify-between items-center gap-4 py-2.5 border-b last:border-0 border-slate-100 dark:border-slate-800 text-sm">
    <span className="text-slate-500 dark:text-slate-400">{label}</span>
    <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{children}</span>
  </div>
);

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetMemberQuery(id);
  const [saveAccess, { isLoading: isSaving }] = useSetMemberAccessMutation();
  const member = data?.data;

  const [access, setAccess] = useState("normal");
  const [tier, setTier] = useState("");
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!member) return;
    setAccess(member.access);
    setTier(member.accessTier || "");
    setUntil(member.manualExpired ? "" : toDateInput(member.accessUntil));
    setNote(member.accessNote || "");
  }, [member]);

  const save = async () => {
    if (access === "blocked") {
      const { isConfirmed } = await Swal.fire({
        title: "Block this member?",
        html: `<b>${escapeHtml(member.name || member.email)}</b> will not get PRO or ad-free access, even while they pay on Patreon or through our Pricing page, until you set them back to Normal.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Yes, block",
        reverseButtons: true,
      });
      if (!isConfirmed) return;
    }
    try {
      await saveAccess({
        id,
        access,
        tier: access === "pro" ? tier : null,
        until: access === "pro" ? fromDateInput(until) : null,
        note,
      }).unwrap();
      toast.success("Access saved");
    } catch (err) {
      toast.error(err?.data?.message || "Could not save access.");
    }
  };

  if (isLoading) return <p className="py-24 text-center text-sm text-slate-500">Loading member...</p>;

  if (isError || !member) {
    return (
      <Card className="max-w-xl mx-auto my-12 text-center p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Member not found</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">{error?.data?.message || "This account could not be loaded."}</p>
        <Button text="Back to Members" icon="heroicons:arrow-left" className="btn-dark mx-auto" onClick={() => navigate("/admin/members")} />
      </Card>
    );
  }

  const link = member.patreon;
  const unchanged =
    access === member.access &&
    note === (member.accessNote || "") &&
    (access !== "pro" ||
      (tier === (member.accessTier || "") && until === (member.manualExpired ? "" : toDateInput(member.accessUntil))));
  // A new manual PRO must name its tier; one saved before tiers existed can still be edited as it is
  const savedWithoutTier = member.access === "pro" && !member.accessTier;
  const needsTier = access === "pro" && !tier && !savedWithoutTier;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/members")}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <Icon icon="heroicons:arrow-left" className="text-xl" />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{member.name || member.email}</h1>
          <p className="text-xs text-slate-500">Member #{member.id}</p>
        </div>
        <div className="ml-auto text-right">
          <AccessBadge member={member} />
          <div className="text-[11px] text-slate-500 mt-1">
            <AccessDetail member={member} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Account">
          <Row label="Email">
            {member.email}
            {!member.emailVerified && <span className="ml-2 text-[11px] text-amber-600">unconfirmed</span>}
          </Row>
          <Row label="Name">{member.name || "—"}</Row>
          <Row label="Signs in with">
            <SignInBadges methods={member.signInMethods} />
          </Row>
          <Row label="Account created">{formatDate(member.createdAt, true)}</Row>
        </Card>

        <Card title="Patreon">
          {link ? (
            <>
              <Row label="Patron of Sketch shaper">{link.isActivePatron ? "Yes, active" : "No"}</Row>
              <Row label="Tier">{link.tier || "—"}</Row>
              <Row label="Pledge">{link.isActivePatron ? `${formatMoney(link.pledgeCents, "USD")} / mo` : "—"}</Row>
              <Row label="Last checked with Patreon">{formatDate(link.lastVerifiedAt, true)}</Row>
              <Row label="Connected on">{formatDate(link.linkedAt)}</Row>
              <Row label="Patreon user ID">
                <span className="font-mono text-xs">{link.patreonId}</span>
              </Row>
              <p className="text-[11px] text-slate-500 mt-3">
                Patreon status is re-checked when they sign in, or when they download a PRO model and the last check is over an hour old.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Not connected to Patreon.</p>
          )}
        </Card>
      </div>

      <Card title="Access">
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => {
            const selected = access === o.access && (o.access !== "pro" || tier === o.tier);
            return (
              <button
                key={o.label}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setAccess(o.access);
                  setTier(o.tier || "");
                }}
                className={`inline-flex items-center justify-center min-w-[96px] px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  selected
                    ? o.access === "blocked"
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-primary-500 border-primary-500 text-white"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {needsTier && <p className="text-xs text-amber-600 mt-2">Choose a tier for this manual PRO.</p>}
        {access === "pro" && !tier && savedWithoutTier && (
          <p className="text-xs text-amber-600 mt-2">This PRO was saved without a tier. Pick one, or keep it as it is.</p>
        )}

        {access === "pro" && (
          <div className="mt-5 max-w-xs">
            <label htmlFor="access-until" className="form-label">
              End date <span className="text-slate-400 font-normal">(leave empty for no end)</span>
            </label>
            <input
              id="access-until"
              type="date"
              min={tomorrow()}
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              className="form-control py-2"
            />
          </div>
        )}

        <div className="mt-5">
          <label htmlFor="access-note" className="form-label">
            Note <span className="text-slate-400 font-normal">(only admins see this)</span>
          </label>
          <textarea
            id="access-note"
            rows={2}
            maxLength={255}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Paid $10 via WhatsApp on 17 Nov"
            className="form-control py-2"
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Button
            text="Save access"
            icon="heroicons:check"
            className={access === "blocked" ? "btn-danger" : "btn-primary"}
            isLoading={isSaving}
            disabled={unchanged || needsTier || isSaving}
            onClick={save}
          />
          {!unchanged && <span className="text-xs text-amber-600">Unsaved changes</span>}
        </div>
      </Card>

      <PaymentsCard member={member} />
    </div>
  );
};

export default MemberDetail;
