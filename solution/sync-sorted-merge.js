"use strict";

// Print all entries, across all of the sources, in chronological order.

// Explanation:
//
// We push the first log from each source onto a minimum priority queue.
// Then until the queue is empty, we pop the minimum from the queue, taking
// care to enqueue another log from the same source as the minimum. Let N
// be the number of logs in the longest log source, and K is the number of
// log sources. Then:
//   * The time complexity is O(N * K * log(K)), because we have to enqueue
//     every log in every source once. There are at most N * K logs and
//     the priority queue has a size of at most K. Enqueueing takes log(K)
//     time.
//   * The space complexity is O(K). The only extra space we use is the
//     priority queue, which is capped at K elements.

const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

module.exports = (logSources, printer) => {

  const pq = new MinPriorityQueue((log) => log.date);
  for (let i = 0; i < logSources.length; i++) {
    const logEntry = logSources[i].pop();
    if (logEntry) {
      pq.push({...logEntry, i});
    }
  }
  while (!pq.isEmpty()) {
    const logEntry = pq.pop();
    printer.print(logEntry);
    const nextLogEntry = logSources[logEntry.i].pop();
    if (nextLogEntry) {
      pq.push({...nextLogEntry, i: logEntry.i});
    }
  }
  printer.done();

  return console.log("Sync sort complete.");
};
