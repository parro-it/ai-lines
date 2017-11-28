import AsyncIterable from "asynciterable";

export default function aiLines(data, separator = /\n/) {
  let buff = { concat: s => s };
  return new AsyncIterable(async (write, end) => {
    const generator = data[Symbol.asyncIterator] || data[Symbol.iterator];
    const iterator = generator.call(data);
    let item = await iterator.next();
    while (!item.done) {
      const chunk = item.value;
      const lines = chunk.split(separator);
      const firstLine = lines.shift();
      const lastLine = lines.pop();

      buff = buff.concat(firstLine);

      if (typeof lastLine === "string") {
        write(buff);
        buff = lastLine;

        for (const otherPart of lines) {
          write(otherPart);
        }
      }

      item = await iterator.next();
    }
    if (typeof buff === "string") {
      end(buff);
    } else {
      end();
    }
  });
}
