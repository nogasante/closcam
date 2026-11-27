import assert from "node:assert/strict";
import test from "node:test";
import { displayUtterance, judgeUtterance, redact, scriptedLine } from "../lib/call/engine.ts";
import { providerOrder } from "../lib/server/gemini.ts";

test("digits are stripped before a model would see them", () => {
  const hidden = redact("The code is 382-194. My PIN is 4491.");
  assert.equal(hidden.includes("382"), false);
  assert.equal(hidden.includes("4491"), false);
  assert.match(hidden, /\[code\]/);
});

test("giving a code or PIN loses, even if the sentence also refuses", () => {
  assert.equal(judgeUtterance("382194"), "loss");
  assert.equal(judgeUtterance("the code is 382194"), "loss");
  assert.equal(judgeUtterance("no, it is 382194"), "loss");
  assert.equal(judgeUtterance("my pin is 4491"), "loss");
});

test("hanging up or refusing without digits wins", () => {
  assert.equal(judgeUtterance("hang up"), "win");
  assert.equal(judgeUtterance("I will not send the code"), "win");
  assert.equal(judgeUtterance("do not call me again"), "win");
});

test("typed and spoken replies share one judge", () => {
  const spoken = "I will not read it";
  const typed = "hang up";
  assert.equal(judgeUtterance(spoken), "win");
  assert.equal(judgeUtterance(typed), "win");
  assert.equal(displayUtterance("382194"), "You read back the code from the text.");
  assert.equal(displayUtterance("449122"), "You entered a code. It was not saved.");
});

test("the scripted line is always available", () => {
  assert.match(scriptedLine("security", []), /PulseLink security/);
});

test("Gemini is used only when its key is present, then the gateway, then the script", () => {
  assert.equal(providerOrder(true, true), "gemini");
  assert.equal(providerOrder(true, false), "gemini");
  assert.equal(providerOrder(false, true), "gateway");
  assert.equal(providerOrder(false, false), "script");
});
