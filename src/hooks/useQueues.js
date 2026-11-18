import { useState, useEffect, useMemo } from "react";
import { initialQueues } from "../data/initialQueues";
import {
  addStudentToQueue,
  callNextStudent,
  completeCurrentStudent,
  toggleQueueStatus,
  getQueueStatistics,
} from "../utils/queueHelpers";
import {
  predictWaitingTime,
  getCrowdStatus,
  recommendAlternative,
} from "../utils/prediction";

const STORAGE_KEY = "queueless_queues_v1";

export function useQueues() {
  const [queues, setQueues] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to read queues from localStorage:", err);
    }
    return initialQueues;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queues));
    } catch (err) {
      console.error("Failed to save queues to localStorage:", err);
    }
  }, [queues]);

  const joinQueue = (queueId, studentName = "Student") => {
    const { updatedQueues, ticket } = addStudentToQueue(
      queues,
      queueId,
      studentName,
    );
    setQueues(updatedQueues);
    return ticket;
  };

  const callNext = (queueId) => {
    setQueues((prev) => callNextStudent(prev, queueId));
  };

  const completeTicket = (queueId) => {
    setQueues((prev) => completeCurrentStudent(prev, queueId));
  };

  const toggleCounterStatus = (queueId) => {
    setQueues((prev) => toggleQueueStatus(prev, queueId));
  };

  const resetAllQueues = () => {
    localStorage.removeItem(STORAGE_KEY);
    setQueues(initialQueues);
  };

  // Enrich each queue with exact fields expected by Harshith's QueueCard contract
  const enrichedQueues = useMemo(() => {
    return queues.map((queue) => {
      const waitingTickets = queue.tickets.filter(
        (t) => t.status === "waiting",
      );
      const waiting = waitingTickets.length;
      const estimatedWait = predictWaitingTime(
        waiting,
        queue.averageServiceTime,
      );
      const crowdStatus = getCrowdStatus(waiting);
      const alternative = recommendAlternative(queues, queue.id);

      return {
        ...queue,
        waiting,
        estimatedWait,
        crowdStatus,
        alternative,
      };
    });
  }, [queues]);

  const statistics = useMemo(() => getQueueStatistics(queues), [queues]);

  return {
    queues: enrichedQueues,
    joinQueue,
    callNext,
    completeTicket,
    toggleCounterStatus,
    resetAllQueues,
    statistics,
  };
}
