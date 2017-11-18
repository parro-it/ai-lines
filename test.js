import test from "tape-async";
import lines from ".";
import concat from "ai-concat";
import AsyncIterable from "asynciterable";

function fromArray(arr) {
  return new AsyncIterable((write, end) => {
    arr.forEach(write);
    end();
  });
}

test("exports a function", async t => {
  t.is(typeof lines, "function");
});

test("emit each chunk as separated line", async t => {
  const textLines = ["test line 1", "line 2"];
  const inLines = lines(fromArray([textLines.join("\n")]));
  t.deepEqual(await concat.obj(inLines), textLines);
});

test("3 lines", async t => {
  const textLines = ["line 1", "line 2", "line 3"];
  const inLines = lines(fromArray([textLines.join("\n")]));
  t.deepEqual(await concat.obj(inLines), textLines);
});

test("empty lines", async t => {
  const textLines = ["line 1", "", "line 3"];
  const inLines = lines(fromArray([textLines.join("\n")]));
  t.deepEqual(await concat.obj(inLines), textLines);
});

test("empty lines at start and end", async t => {
  const textLines = ["", "line 1", "", "line 3", ""];
  const inLines = lines(fromArray([textLines.join("\n")]));
  t.deepEqual(await concat.obj(inLines), textLines);
});

test("single line", async t => {
  const textLines = ["line 3"];
  const inLines = lines(fromArray([textLines.join("\n")]));
  t.deepEqual(await concat.obj(inLines), textLines);
});

test("single empty line", async t => {
  const textLines = [""];
  const inLines = lines(fromArray([textLines.join("\n")]));
  t.deepEqual(await concat.obj(inLines), textLines);
});

test("empty stream", async t => {
  const inLines = lines(fromArray([]));
  t.deepEqual(await concat.obj(inLines), []);
});
