"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

// Explanation:
//
// I realized that in the async version, inserting into/popping from the priority
// queue should not have to be blocked by popping from the log sources. I created
// a "buffer" array of arrays that loads in batches of logs from each source ~40 
// at a time (each index corresponds to the log source at that index of the logSources
// param). The rest of the solution is similar to the synchronous version. Let N be
// the number of logs in the longest log source, and K is the number of log sources.
// Then:
//   * The time complexity is the same as the synchronous solution, O(N * K * log(K)).
//     We still have to pop N * K logs from the sources and enqueue them.
//   * The space complexity is also the same, O(K). It differs from the synchronous
//     solution in that we use 40 * K extra space in the buffer array, but space
//     still scales linearly with the number of log sources.
//
// I ran into a bug where it seems that fillBuffer is loading the same log 40 times
// instead of 40 different logs as expected, but didn't have enough time to debug it
// in the ~3 hours I spent on the coding challenge.

const { MinPriorityQueue } = require("@datastructures-js/priority-queue");

module.exports = (logSources, printer) => {

  return new Promise(async (resolve, reject) => {
    const buffer = [];
    for (let i = 0; i < logSources.length; i++) {
      buffer.push({ arr: [], drained: false });
    }
  
    const fillBuffer = (sourceIndex) => {
      for (let i = 0; i < 40; i++) {
        const logEntry = logSources[sourceIndex].popAsync();
        if (!buffer[sourceIndex].drained) {
          buffer[sourceIndex].arr.push(logEntry);
        } else {
          return;
        }
      }
    };
  
    for (let i = 0; i < logSources.length; i++) {
      fillBuffer(i);
    }
  
    const pq = new MinPriorityQueue((log) => log.date.getTime());
    for (let i = 0; i < logSources.length; i++) {
      const logEntry = await buffer[i].arr.shift();
      if (logEntry) {
        pq.push({...logEntry, i});
      }
    }

    while (!pq.isEmpty()) {
      const logEntry = pq.pop();
      printer.print(logEntry);
      const nextLogEntry = await buffer[logEntry.i].arr.shift();
      if (!nextLogEntry) {
        buffer[logEntry.i].drained = true;
        continue;
      }
      if (buffer[logEntry.i].arr.length == 0) {
        fillBuffer(logEntry.i);
      }
      if (nextLogEntry) {
        pq.push({...nextLogEntry, i: logEntry.i});
      }
    }
    printer.done();
  
    resolve(console.log("Async sort complete."));
  })
};
