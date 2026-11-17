import { it } from "node:test";
import assert from "node:assert/strict";
import { currencyOptions, currencySymbol, formatMoney, isCurrency, parseAmount } from "./money.js";

it("formats amounts with clear symbols and each currency's decimals", () => {
  assert.equal(formatMoney(1050, "USD"), "$10.50");
  assert.equal(formatMoney(125050, "BDT"), "৳1,250.50");
  assert.equal(formatMoney(1500, "GBP"), "£15.00");
  assert.equal(formatMoney(2000, "EUR"), "€20.00");
  assert.equal(formatMoney(500, "JPY"), "¥500");
  assert.match(formatMoney(1234, "BHD"), /^BHD\s1\.234$/);
  assert.equal(formatMoney(1000, "CAD"), "CA$10.00", "not a bare $ that looks like USD");
  assert.equal(currencySymbol("BDT"), "৳");
});

it("parses what the admin types into exact minor units", () => {
  assert.deepEqual(parseAmount("1,250.50", "BDT"), { minor: 125050 });
  assert.deepEqual(parseAmount("10", "USD"), { minor: 1000 });
  assert.deepEqual(parseAmount("500", "JPY"), { minor: 500 });
  assert.deepEqual(parseAmount("1.234", "BHD"), { minor: 1234 });
});

it("explains what is wrong instead of guessing", () => {
  assert.match(parseAmount("10.555", "USD").error, /at most 2 decimals/);
  assert.match(parseAmount("10.5", "JPY").error, /no decimals/);
  assert.match(parseAmount("0", "USD").error, /more than 0/);
  assert.match(parseAmount("", "USD").error, /as a number/);
  assert.match(parseAmount("-3", "USD").error, /as a number/);
  assert.match(parseAmount("99999999999999", "USD").error, /too large/);
});

it("offers the ten currencies, with labels the picker can search by code, symbol or name", () => {
  const options = currencyOptions();
  assert.deepEqual(options.map((o) => o.value), ["USD", "EUR", "GBP", "BDT", "INR", "AED", "SAR", "CAD", "AUD", "JPY"]);
  assert.equal(options.find((o) => o.value === "BDT").label, "BDT · ৳ · Bangladeshi Taka");
  assert.equal(isCurrency("BDT"), true);
  assert.equal(isCurrency("CHF"), false, "not in the list");
});
