export function predictWaitingTime(position, averageServiceTime) {
  return Math.max(0, position * averageServiceTime);
}

export function getCrowdStatus(waiting) {
  if (waiting <= 5) return "Low";
  if (waiting <= 12) return "Moderate";
  return "High";
}

export function recommendAlternative(queues, currentQueueId) {
  const currentQueue = queues.find((q) => q.id === currentQueueId);
  if (!currentQueue) return null;

  const currentWaitingCount = currentQueue.tickets.filter(
    (t) => t.status === "waiting",
  ).length;
  const currentEstWait = predictWaitingTime(
    currentWaitingCount,
    currentQueue.averageServiceTime,
  );

  // Only recommend open counters that handle a compatible category and have lower wait time
  const compatibleAlternatives = queues
    .filter(
      (q) =>
        q.id !== currentQueueId &&
        q.status === "open" &&
        q.category === currentQueue.category,
    )
    .map((q) => {
      const waitingCount = q.tickets.filter(
        (t) => t.status === "waiting",
      ).length;
      const estimatedWait = predictWaitingTime(
        waitingCount,
        q.averageServiceTime,
      );
      return {
        ...q,
        waitingCount,
        estimatedWait,
      };
    })
    .filter((q) => q.estimatedWait < currentEstWait)
    .sort((a, b) => a.estimatedWait - b.estimatedWait);

  return compatibleAlternatives.length > 0 ? compatibleAlternatives[0] : null;
}
