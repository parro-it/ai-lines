export default async function* aiLines(stream, separator = /\n/) {
  let buff = { concat: s => s };
  for await (const chunk of stream) {
    const lines = chunk.split(separator);
    const firstLine = lines.shift();
    const lastLine = lines.pop();

    buff = buff.concat(firstLine);

    if (typeof lastLine === "string") {
      yield buff;
      buff = lastLine;

      for (const otherPart of lines) {
        yield otherPart;
      }
    }
  }

  if (typeof buff === "string") {
    yield buff;
  }
}
