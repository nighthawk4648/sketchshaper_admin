import { useMemo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { escapeHtml } from "@/utils/escapeHtml";
import { currencyOptions, formatMoney, isCurrency, parseAmount } from "@/utils/money";
import {
  useAddMemberPaymentMutation,
  useDeleteMemberPaymentMutation,
  useGetMemberPaymentsQuery,
} from "@/store/api/app/Members/membersApiSlice";
import { formatDate } from "./memberBadges";

const LAST_CURRENCY = "admin.lastCurrency";

// Joined to the amount box on its right; the menu is wider so names fit
const pickerStyles = {
  control: (base) => ({ ...base, minHeight: 40, height: 40, borderTopRightRadius: 0, borderBottomRightRadius: 0 }),
  menu: (base) => ({ ...base, width: 320, zIndex: 30 }),
  option: (base) => ({ ...base, fontSize: 14 }),
};
const todayLocal = () => new Date().toLocaleDateString("en-CA");

// Only a convenience: storage can be blocked, so it falls back to USD
function readLastCurrency() {
  try {
    const saved = localStorage.getItem(LAST_CURRENCY);
    return isCurrency(saved) ? saved : "USD";
  } catch {
    return "USD";
  }
}
function saveLastCurrency(code) {
  try {
    localStorage.setItem(LAST_CURRENCY, code);
  } catch {
    // storage blocked: nothing to remember
  }
}

// Recording a payment does not change access; the admin sets that in the Access card
const PaymentsCard = ({ member }) => {
  const { data, isLoading } = useGetMemberPaymentsQuery(member.id);
  const [addPayment, { isLoading: isAdding }] = useAddMemberPaymentMutation();
  const [deletePayment] = useDeleteMemberPaymentMutation();

  const [currency, setCurrency] = useState(readLastCurrency);
  const options = useMemo(currencyOptions, []);
  const selected = options.find((o) => o.value === currency);
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState(todayLocal);
  const [note, setNote] = useState("");

  const payments = data?.data?.payments || [];
  const totals = data?.data?.totals || [];
  const parsed = amount.trim() ? parseAmount(amount, currency) : null;
  const currencyName = selected?.name;
  const canAdd = parsed?.minor && paidOn && paidOn <= todayLocal() && !isAdding;

  const add = async () => {
    try {
      await addPayment({ id: member.id, amount, currency, paidOn, note }).unwrap();
      saveLastCurrency(currency);
      setAmount("");
      setNote("");
      setPaidOn(todayLocal()); // so the next payment is not dated by accident
      toast.success(`Recorded ${formatMoney(parsed.minor, currency)}`);
    } catch (err) {
      toast.error(err?.data?.message || "Could not record the payment.");
    }
  };

  const remove = async (p) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete this payment?",
      html: `<b>${escapeHtml(formatMoney(p.amountMinor, p.currency))}</b> paid on ${escapeHtml(formatDate(p.paidOn))} by <b>${escapeHtml(member.name || member.email)}</b> will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
      reverseButtons: true,
    });
    if (!isConfirmed) return;
    try {
      await deletePayment({ id: member.id, paymentId: p.id }).unwrap();
      toast.success("Payment deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Could not delete the payment.");
    }
  };

  return (
    <Card title="Payments">
      <div className="flex flex-col lg:flex-row lg:items-start gap-3">
        <div className="lg:w-72">
          <label htmlFor="pay-amount" className="form-label">Amount</label>
          <div className="flex h-[40px]">
            <Select
              aria-label="Currency"
              inputId="pay-currency"
              className="react-select w-[124px] shrink-0"
              classNamePrefix="select"
              options={options}
              value={selected}
              onChange={(o) => setCurrency(o.value)}
              formatOptionLabel={(o, { context }) => (context === "value" ? `${o.symbol} ${o.value}` : o.label)}
              styles={pickerStyles}
              isSearchable
            />
            <input
              id="pay-amount"
              inputMode="decimal"
              autoComplete="off"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canAdd && add()}
              placeholder="0.00"
              className="form-control rounded-l-none h-full"
            />
          </div>
          <p className={`text-xs mt-1.5 min-h-[16px] ${parsed?.error ? "text-amber-600" : "text-slate-500"}`}>
            {parsed?.error || (parsed?.minor ? `${formatMoney(parsed.minor, currency)} · ${currencyName}` : currencyName)}
          </p>
        </div>

        <div className="lg:w-44">
          <label htmlFor="pay-date" className="form-label">Date paid</label>
          <input
            id="pay-date"
            type="date"
            max={todayLocal()}
            value={paidOn}
            onChange={(e) => setPaidOn(e.target.value)}
            className="form-control h-[40px]"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="pay-note" className="form-label">
            Note <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="pay-note"
            maxLength={255}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. via bKash"
            className="form-control h-[40px]"
          />
        </div>

        <div>
          {/* Same height as the other labels, so the button lines up with the boxes */}
          <span aria-hidden="true" className="form-label invisible hidden lg:block">&nbsp;</span>
          <Button
            text="Add payment"
            icon="heroicons:plus"
            className="btn-primary h-[40px] whitespace-nowrap"
            isLoading={isAdding}
            disabled={!canAdd}
            onClick={add}
          />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="text-slate-500">Total paid: </span>
          {totals.length ? (
            <b className="text-slate-900 dark:text-white">
              {totals.map((t) => formatMoney(t.amountMinor, t.currency)).join(" · ")}
            </b>
          ) : (
            "nothing recorded yet"
          )}
        </p>

        {isLoading && <p className="text-sm text-slate-500 mt-3">Loading payments...</p>}

        {payments.length > 0 && (
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-700/60">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-2.5 text-sm">
                <span className="w-28 shrink-0 text-slate-500">{formatDate(p.paidOn)}</span>
                <span className="w-32 shrink-0 font-semibold text-slate-900 dark:text-white">
                  {formatMoney(p.amountMinor, p.currency)}
                </span>
                <span className="flex-1 min-w-0 truncate text-slate-600 dark:text-slate-300">{p.note || ""}</span>
                <span className="hidden md:inline text-xs text-slate-400 truncate max-w-[200px]">{p.addedBy}</span>
                <button
                  type="button"
                  aria-label={`Delete payment of ${formatMoney(p.amountMinor, p.currency)}`}
                  onClick={() => remove(p)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Icon icon="heroicons:trash" className="text-base" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default PaymentsCard;
