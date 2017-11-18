import test from "tape-async";
import aiLines from ".";

test("exports a function", t => {
  t.is(typeof aiLines, "function");
});
