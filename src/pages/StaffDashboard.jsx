import React, { useState } from "react";
import {
  Users,
  UserCheck,
  CheckCircle2,
  Store,
  Play,
  Check,
  Power,
} from "lucide-react";

export default function StaffDashboard({
  queues,
  statistics,
  onCallNext,
  onCompleteTicket,
  onToggleCounterStatus,
}) {
  const [selectedQueueId, setSelectedQueueId] = useState(
    queues[0]?.id || "office",
  );

  const activeQueue = queues.find((q) => q.id === selectedQueueId) || queues[0];

  const servingTicket = activeQueue?.tickets.find(
    (t) => t.status === "serving",
  );
  const waitingTickets =
    activeQueue?.tickets.filter((t) => t.status === "waiting") || [];
  const completedTickets =
    activeQueue?.tickets.filter((t) => t.status === "completed") || [];

  const formatMinutesWaited = (joinedAt) => {
    if (!joinedAt) return "0m";
    const mins = Math.max(0, Math.floor((Date.now() - joinedAt) / 60000));
    return `${mins}m`;
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h2>Staff Dashboard</h2>

      {/* 4 Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#555",
            }}
          >
            <span>Total Waiting</span>
            <Users size={18} />
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", marginTop: "6px" }}
          >
            {statistics.totalWaiting}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#555",
            }}
          >
            <span>Currently Serving</span>
            <UserCheck size={18} />
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", marginTop: "6px" }}
          >
            {statistics.currentlyServing}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#555",
            }}
          >
            <span>Completed Today</span>
            <CheckCircle2 size={18} />
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", marginTop: "6px" }}
          >
            {statistics.completedToday}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#555",
            }}
          >
            <span>Active Counters</span>
            <Store size={18} />
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", marginTop: "6px" }}
          >
            {statistics.activeCounters} / {queues.length}
          </div>
        </div>
      </div>

      {/* Counter Selection Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {queues.map((q) => (
          <button
            key={q.id}
            onClick={() => setSelectedQueueId(q.id)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border:
                q.id === activeQueue.id
                  ? "2px solid #4f46e5"
                  : "1px solid #ccc",
              background: q.id === activeQueue.id ? "#eef2ff" : "#fff",
              fontWeight: q.id === activeQueue.id ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            {q.name} ({q.waiting})
          </button>
        ))}
      </div>

      {/* Selected Counter Control Header */}
      {activeQueue && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fff",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "18px",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{activeQueue.name}</h3>
              <span style={{ fontSize: "13px", color: "#555" }}>
                Status: <strong>{activeQueue.status.toUpperCase()}</strong> •
                Avg Service: {activeQueue.averageServiceTime} min/student
              </span>
            </div>

            <button
              onClick={() => onToggleCounterStatus(activeQueue.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background:
                  activeQueue.status === "open" ? "#dc2626" : "#16a34a",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <Power size={16} />
              {activeQueue.status === "open" ? "Close Counter" : "Open Counter"}
            </button>
          </div>

          {/* Currently Serving Box */}
          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              CURRENTLY SERVING
            </div>

            {servingTicket ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#4f46e5",
                    }}
                  >
                    {servingTicket.ticketNumber}
                  </span>{" "}
                  — <strong>{servingTicket.studentName}</strong>
                </div>

                <button
                  onClick={() => onCompleteTicket(activeQueue.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#059669",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <Check size={16} /> Complete Service
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <span style={{ color: "#64748b" }}>
                  No student currently being served.
                </span>

                <button
                  disabled={
                    waitingTickets.length === 0 || activeQueue.status !== "open"
                  }
                  onClick={() => onCallNext(activeQueue.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: "none",
                    background:
                      waitingTickets.length > 0 && activeQueue.status === "open"
                        ? "#4f46e5"
                        : "#9ca3af",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor:
                      waitingTickets.length > 0 && activeQueue.status === "open"
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  <Play size={16} /> Call Next Student
                </button>
              </div>
            )}
          </div>

          {/* Waiting List */}
          <h4>Waiting Queue ({waitingTickets.length})</h4>
          {waitingTickets.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No students waiting in this queue.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {waitingTickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  style={{
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>#{index + 1}</strong> —{" "}
                    <span style={{ fontWeight: "bold", color: "#4f46e5" }}>
                      {ticket.ticketNumber}
                    </span>{" "}
                    ({ticket.studentName})
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    Waited: {formatMinutesWaited(ticket.joinedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Summary */}
          {completedTickets.length > 0 && (
            <div
              style={{ marginTop: "20px", fontSize: "13px", color: "#64748b" }}
            >
              Completed at this counter today:{" "}
              <strong>{completedTickets.length}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
