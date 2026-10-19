import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONTENT_SECURITY_POLICY,
  REMIX_URL,
  externalUrl,
  isPermissionGranted,
  isRemixUrl,
  withContentSecurityPolicy,
} from "../src/policy.ts";

describe("isRemixUrl", () => {
  it("accepts the Remix origin over HTTPS", () => {
    assert.equal(isRemixUrl(REMIX_URL), true);
    assert.equal(isRemixUrl("https://remix.ethereum.org/#lang=en&optimize=false"), true);
    assert.equal(isRemixUrl("https://remix.ethereum.org"), true);
  });

  it("rejects plain HTTP, other hosts and look-alike hosts", () => {
    assert.equal(isRemixUrl("http://remix.ethereum.org/"), false);
    assert.equal(isRemixUrl("https://remix.ethereum.org.attacker.example/"), false);
    assert.equal(isRemixUrl("https://attacker.example/?u=https://remix.ethereum.org"), false);
    assert.equal(isRemixUrl("https://remix.ethereum.org:8443/"), false);
    assert.equal(isRemixUrl("file:///etc/passwd"), false);
  });

  it("rejects strings that are not URLs", () => {
    assert.equal(isRemixUrl(""), false);
    assert.equal(isRemixUrl("remix.ethereum.org"), false);
  });
});

describe("externalUrl", () => {
  it("passes HTTPS links through, normalised", () => {
    assert.equal(externalUrl("https://docs.soliditylang.org/en/latest"), "https://docs.soliditylang.org/en/latest");
    assert.equal(externalUrl("HTTPS://Etherscan.io"), "https://etherscan.io/");
  });

  it("refuses every other scheme", () => {
    for (const url of [
      "http://example.com/",
      "file:///C:/Windows/System32/calc.exe",
      "javascript:alert(1)",
      "smb://host/share",
      "ms-msdt:/id",
      "not a url",
    ]) {
      assert.equal(externalUrl(url), null, url);
    }
  });
});

describe("isPermissionGranted", () => {
  it("grants clipboard and fullscreen to Remix", () => {
    for (const permission of ["clipboard-read", "clipboard-sanitized-write", "fullscreen"]) {
      assert.equal(isPermissionGranted(permission, REMIX_URL), true, permission);
    }
  });

  it("accepts a bare origin, as the permission check handler passes", () => {
    assert.equal(isPermissionGranted("clipboard-sanitized-write", "https://remix.ethereum.org"), true);
  });

  it("denies anything outside the allow-list, even for Remix", () => {
    for (const permission of ["media", "geolocation", "notifications", "openExternal", "usb", "unknown"]) {
      assert.equal(isPermissionGranted(permission, REMIX_URL), false, permission);
    }
  });

  it("denies allowed permissions to every other origin", () => {
    assert.equal(isPermissionGranted("clipboard-read", "https://plugin.example/"), false);
    assert.equal(isPermissionGranted("clipboard-read", "http://remix.ethereum.org/"), false);
    assert.equal(isPermissionGranted("clipboard-read", "https://remix.ethereum.org.attacker.example/"), false);
    assert.equal(isPermissionGranted("clipboard-read", ""), false);
  });
});

describe("withContentSecurityPolicy", () => {
  it("adds the policy when the response has none", () => {
    assert.deepEqual(withContentSecurityPolicy({ "Content-Type": ["text/html"] }), {
      "Content-Type": ["text/html"],
      "Content-Security-Policy": [CONTENT_SECURITY_POLICY],
    });
    assert.deepEqual(withContentSecurityPolicy(undefined), {
      "Content-Security-Policy": [CONTENT_SECURITY_POLICY],
    });
  });

  it("keeps a policy the site sends and adds ours beside it", () => {
    const result = withContentSecurityPolicy({ "content-security-policy": ["default-src 'self'"] });
    assert.deepEqual(result, { "content-security-policy": ["default-src 'self'", CONTENT_SECURITY_POLICY] });
  });

  it("does not modify the headers it was given", () => {
    const headers = { "Content-Security-Policy": ["default-src 'self'"] };
    withContentSecurityPolicy(headers);
    assert.deepEqual(headers, { "Content-Security-Policy": ["default-src 'self'"] });
  });

  it("blocks plugins and base-tag hijacking", () => {
    assert.match(CONTENT_SECURITY_POLICY, /object-src 'none'/);
    assert.match(CONTENT_SECURITY_POLICY, /base-uri 'self'/);
  });
});
