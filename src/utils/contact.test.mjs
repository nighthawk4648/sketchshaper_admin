import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  toWhatsAppNumber,
  isSafeHttpUrl,
  getServiceTypeInfo,
  SERVICE_TYPE_CONFIG,
  buildReplyMailto,
} from "./contact.js";

describe("Admin Contact Utilities Test Suite", () => {
  describe("toWhatsAppNumber normalization", () => {
    it("handles local 11-digit Bangladeshi mobile numbers by prepending 88", () => {
      assert.equal(toWhatsAppNumber("01712345678"), "8801712345678");
      assert.equal(toWhatsAppNumber("018-9999-8888"), "8801899998888");
      assert.equal(toWhatsAppNumber("(019) 11-22-33-44"), "8801911223344");
    });

    it("preserves Bangladeshi numbers already containing the country code 88", () => {
      assert.equal(toWhatsAppNumber("8801712345678"), "8801712345678");
      assert.equal(toWhatsAppNumber("+880 1712-345678"), "8801712345678");
    });

    it("strips double-zero international prefixes cleanly", () => {
      assert.equal(toWhatsAppNumber("00447911123456"), "447911123456");
      assert.equal(toWhatsAppNumber("0015551234567"), "15551234567");
    });

    it("formats standard international numbers with country codes", () => {
      assert.equal(toWhatsAppNumber("+1 (555) 234-5678"), "15552345678");
      assert.equal(toWhatsAppNumber("+44 7911 123456"), "447911123456");
      assert.equal(toWhatsAppNumber("+971 50 123 4567"), "971501234567");
    });

    it("rejects invalid, empty, or too-short numbers", () => {
      assert.equal(toWhatsAppNumber(""), null);
      assert.equal(toWhatsAppNumber(null), null);
      assert.equal(toWhatsAppNumber("12345"), null); // under 8 digits
      assert.equal(toWhatsAppNumber("not-a-number"), null);
    });
  });

  describe("isSafeHttpUrl validation", () => {
    it("accepts valid fully qualified http and https URLs", () => {
      assert.equal(isSafeHttpUrl("https://drive.google.com/drive/folders/test"), true);
      assert.equal(isSafeHttpUrl("http://dropbox.com/sh/abc123xyz"), true);
      assert.equal(isSafeHttpUrl("https://pinterest.com/pin/12345/"), true);
    });

    it("accepts bare domain links by auto-prefixing https://", () => {
      assert.equal(isSafeHttpUrl("drive.google.com/drive/folders/123"), true);
      assert.equal(isSafeHttpUrl("dropbox.com/sh/123"), true);
      assert.equal(isSafeHttpUrl("wetransfer.com/downloads/xyz"), true);
    });

    it("strictly rejects dangerous protocols and non-domain strings", () => {
      assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
      assert.equal(isSafeHttpUrl("data:text/html,test"), false);
      assert.equal(isSafeHttpUrl("file:///etc/passwd"), false);
      assert.equal(isSafeHttpUrl("drive google com"), false);
      assert.equal(isSafeHttpUrl("localhost"), false);
      assert.equal(isSafeHttpUrl(""), false);
      assert.equal(isSafeHttpUrl(null), false);
    });
  });

  describe("getServiceTypeInfo badge config", () => {
    it("returns correct configuration for all 5 commission categories", () => {
      const types = ["architecture", "single-model", "textures", "extension", "support"];
      for (const t of types) {
        const info = getServiceTypeInfo(t);
        assert.ok(info.label);
        assert.ok(info.badgeClass);
        assert.ok(info.dotClass);
        assert.ok(info.icon);
        assert.equal(info.label, SERVICE_TYPE_CONFIG[t].label);
      }
    });

    it("provides graceful fallback for legacy or null service types", () => {
      const fallback = getServiceTypeInfo(null);
      assert.equal(fallback.label, "Homepage Message");
      assert.ok(fallback.badgeClass);
      assert.ok(fallback.icon);

      const unknown = getServiceTypeInfo("unknown-type");
      assert.equal(unknown.label, "unknown-type");
    });
  });

  describe("buildReplyMailto", () => {
    it("encodes names containing & and # inside the body", () => {
      const url = buildReplyMailto({
        email: "client@example.com",
        name: "A&B #1",
        scope: "Full Interior Design & 3D Render",
        message: "Hello",
      });
      assert.ok(url.startsWith("mailto:client%40example.com?subject="));
      const params = new URLSearchParams(url.split("?")[1]);
      assert.equal(params.get("subject"), "Re: Full Interior Design & 3D Render - SketchShaper");
      assert.ok(params.get("body").includes("Original message from A&B #1:\nHello"));
    });

    it("truncates very long messages", () => {
      const url = buildReplyMailto({
        email: "a@b.co",
        name: "X",
        scope: "Inquiry",
        message: "z".repeat(5000),
      });
      const body = new URLSearchParams(url.split("?")[1]).get("body");
      assert.ok(body.includes("[...truncated]"));
      assert.ok(body.length < 1200);
    });

    it("omits the body when includeOriginal is false", () => {
      const url = buildReplyMailto({ email: "a@b.co", name: "X", scope: "Inquiry", message: "hi", includeOriginal: false });
      assert.ok(!url.includes("body="));
    });
  });
});
