// Mirrors the backend's src/utils/money.mjs, so the admin sees the same errors before the server would send them.

// The picker offers only these; the server still accepts any real currency code
export const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR", "AED", "SAR", "CAD", "AUD", "JPY"];

const MAX_MINOR = 2_000_000_000;

export const fractionDigits = (currency) =>
  new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits;

// Clear and unambiguous: $, £, €, CA$, A$, and ৳ (where the standard form would just repeat the code)
function displayFor(currency) {
  const symbol = (display) =>
    new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: display })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value;
  return symbol("symbol") === currency ? "narrowSymbol" : "symbol";
}

export const currencySymbol = (currency) =>
  new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: displayFor(currency) })
    .formatToParts(0)
    .find((p) => p.type === "currency")?.value || currency;

// 125050 + "BDT" -> "৳1,250.50"
export const formatMoney = (amountMinor, currency) =>
  new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: displayFor(currency) }).format(
    amountMinor / 10 ** fractionDigits(currency),
  );

export const isCurrency = (code) => CURRENCIES.includes(code);

// Options for react-select. The label holds code, symbol and name, so typing "bdt", "৳" or "taka" finds it.
export function currencyOptions() {
  const names = new Intl.DisplayNames(["en"], { type: "currency" });
  return CURRENCIES.map((code) => {
    const symbol = currencySymbol(code);
    const name = names.of(code);
    return { value: code, label: `${code} · ${symbol} · ${name}`, symbol, name };
  });
}

// What the admin typed -> { minor } or { error }, with the same messages as the server
export function parseAmount(input, currency) {
  const digits = fractionDigits(currency);
  const match = /^(\d+)(?:\.(\d+))?$/.exec(String(input ?? "").replace(/[,\s]/g, ""));
  if (!match) return { error: "Enter the amount as a number, e.g. 1250 or 1250.50." };
  const [, whole, fraction = ""] = match;
  if (fraction.length > digits) {
    return { error: digits === 0 ? `${currency} has no decimals.` : `${currency} allows at most ${digits} decimals.` };
  }
  if (whole.replace(/^0+/, "").length > 12) return { error: "That amount is too large." };
  const minor = Number(whole + fraction.padEnd(digits, "0"));
  if (minor <= 0) return { error: "The amount must be more than 0." };
  if (minor > MAX_MINOR) return { error: "That amount is too large." };
  return { minor };
}
