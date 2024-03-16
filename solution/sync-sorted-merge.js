"use strict";

// Print all entries, across all of the sources, in chronological order.

const {MinPriorityQueue} = require('@datastructures-js/priority-queue')

module.exports = (logSources, printer) => {

  const pq = new MinPriorityQueue((log) => log.date)
  for (let i = 0; i < logSources.length; i++) {
    const logSource = logSources[i]
    const logEntry = logSource.pop()
    if (!logEntry) {
      continue
    }
    pq.push({...logEntry, i})
  }
  while (!pq.isEmpty()) {
    const logEntry = pq.pop()
    printer.print(logEntry)
    const nextLogEntry = logSources[logEntry.i].pop()
    if (!nextLogEntry) {
      continue
    }
    pq.push({...nextLogEntry, i: logEntry.i})
  }
  printer.done()

  return console.log("Sync sort complete.");
};
