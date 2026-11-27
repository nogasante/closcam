import assert from "node:assert/strict";
import test from "node:test";
import { normalizePhone } from "../lib/community/normalize.ts";

test("Ghana numbers share one form", () => {
  assert.equal(normalizePhone("055 441 9088"), "+233554419088");
  assert.equal(normalizePhone("+233554419088"), "+233554419088");
  assert.equal(normalizePhone("233554419088"), "+233554419088");
});
