import { predictWaitingTime } from "./prediction";

export function addStudentToQueue(queues, queueId, studentName = "Student") {
  let createdTicket = null;

  const updatedQueues = queues.map((queue) => {
    if (queue.id !== queueId || queue.status !== "open") return queue;

    const nextSequence = queue.tickets.length + 1;
    const ticketNumber = `${queue.prefix}${String(nextSequence).padStart(3, "0")}`;
    const waitingAhead = queue.tickets.filter(
      (t) => t.status === "waiting",
    ).length;
    const position = waitingAhead + 1;

    createdTicket = {
      id: `${queueId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticketNumber,
      queueId: queue.id,
      queueName: queue.name,
      studentName: studentName.trim() || "Student",
      status: "waiting",
      position,
      estimatedWait: predictWaitingTime(position, queue.averageServiceTime),
      joinedAt: Date.now(),
      servedAt: null,
      completedAt: null,
      serviceDuration: null,
    };

    return {
      ...queue,
      tickets: [...queue.tickets, createdTicket],
    };
  });

  return { updatedQueues, ticket: createdTicket };
}

export function callNextStudent(queues, queueId) {
  return queues.map((queue) => {
    if (queue.id !== queueId) return queue;

    // Prevent calling another student if someone is currently being served
    const alreadyServing = queue.tickets.some((t) => t.status === "serving");
    if (alreadyServing) return queue;

    const nextWaitingIndex = queue.tickets.findIndex(
      (t) => t.status === "waiting",
    );
    if (nextWaitingIndex === -1) return queue;

    const updatedTickets = queue.tickets.map((ticket, index) => {
      if (index === nextWaitingIndex) {
        return {
          ...ticket,
          status: "serving",
          position: 0,
          estimatedWait: 0,
          servedAt: Date.now(),
        };
      }
      return ticket;
    });

    return recalculateQueuePositions({
      ...queue,
      tickets: updatedTickets,
    });
  });
}

export function completeCurrentStudent(queues, queueId) {
  return queues.map((queue) => {
    if (queue.id !== queueId) return queue;

    const updatedTickets = queue.tickets.map((ticket) => {
      if (ticket.status === "serving") {
        const completedAt = Date.now();
        const startTime = ticket.servedAt || ticket.joinedAt || completedAt;
        const serviceDuration = Math.max(
          1,
          Math.round((completedAt - startTime) / 60000),
        );

        return {
          ...ticket,
          status: "completed",
          completedAt,
          serviceDuration,
        };
      }
      return ticket;
    });

    return recalculateQueuePositions({
      ...queue,
      tickets: updatedTickets,
    });
  });
}

export function toggleQueueStatus(queues, queueId) {
  return queues.map((queue) => {
    if (queue.id !== queueId) return queue;
    return {
      ...queue,
      status: queue.status === "open" ? "closed" : "open",
    };
  });
}

export function recalculateQueuePositions(queue) {
  let waitingIndex = 0;

  const updatedTickets = queue.tickets.map((ticket) => {
    if (ticket.status === "waiting") {
      waitingIndex += 1;
      return {
        ...ticket,
        position: waitingIndex,
        estimatedWait: predictWaitingTime(
          waitingIndex,
          queue.averageServiceTime,
        ),
      };
    }
    return ticket;
  });

  return {
    ...queue,
    tickets: updatedTickets,
  };
}

export function getStudentPosition(queue, ticketId) {
  if (!queue) return -1;
  const waitingTickets = queue.tickets.filter((t) => t.status === "waiting");
  const index = waitingTickets.findIndex((t) => t.id === ticketId);
  return index === -1 ? 0 : index + 1;
}

export function getQueueStatistics(queues) {
  let totalWaiting = 0;
  let currentlyServing = 0;
  let completedToday = 0;
  let activeCounters = 0;

  queues.forEach((queue) => {
    if (queue.status === "open") activeCounters += 1;

    queue.tickets.forEach((ticket) => {
      if (ticket.status === "waiting") totalWaiting += 1;
      if (ticket.status === "serving") currentlyServing += 1;
      if (ticket.status === "completed") completedToday += 1;
    });
  });

  return {
    totalWaiting,
    currentlyServing,
    completedToday,
    activeCounters,
  };
}
