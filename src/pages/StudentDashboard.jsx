import React, { useState, useMemo } from "react";
import { Users, Clock, Ticket, AlertCircle, CheckCircle2 } from "lucide-react";

export default function StudentDashboard({ queues, onJoinQueue }) {
  const [studentName, setStudentName] = useState("");
  const [selectedQueueId, setSelectedQueueId] = useState(null);
  const [myTicketIds, setMyTicketIds] = useState(() => {
    try {
      const saved = localStorage.getItem("queueless_my_tickets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveTicketId = (id) => {
    setMyTicketIds((prev) => {
      const updated = [id, ...prev];
      localStorage.setItem("queueless_my_tickets", JSON.stringify(updated));
      return updated;
    });
  };

  const selectedQueue = queues.find((q) => q.id === selectedQueueId) || null;

  const handleConfirmJoin = (e) => {
    e.preventDefault();
    if (!selectedQueueId) return;

    const newTicket = onJoinQueue(
      selectedQueueId,
      studentName.trim() || "Student",
    );
    if (newTicket) {
      saveTicketId(newTicket.id);
    }
    setSelectedQueueId(null);
  };

  // Find live state of this student's tickets across all queues
  const myLiveTickets = useMemo(() => {
    const allTickets = queues.flatMap((q) => q.tickets);
    return myTicketIds
      .map((id) => allTickets.find((t) => t.id === id))
      .filter(Boolean);
  }, [queues, myTicketIds]);

  const getCrowdBadgeColor = (status) => {
    if (status === "Low") return "#dcfce7";
    if (status === "Moderate") return "#fef9c3";
    return "#fee2e2";
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h2>Student Dashboard</h2>

      {/* Student Name Input */}
      <div
        style={{
          marginBottom: "20px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <label
          style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}
        >
          Your Name (used when joining a counter):
        </label>
        <input
          type="text"
          placeholder="Enter your name (e.g., Joshua)"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "100%",
            maxWidth: "350px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 5 Counters Grid */}
      <h3>Available Counters</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        {queues.map((queue) => (
          <div
            key={queue.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              background: "#fff",
              opacity: queue.status === "open" ? 1 : 0.65,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <strong>{queue.name}</strong>
              <span
                style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  background: queue.status === "open" ? "#e0e7ff" : "#e5e7eb",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {queue.status}
              </span>
            </div>

            <p
              style={{
                margin: "6px 0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Users size={16} /> Waiting: <strong>{queue.waiting}</strong>
            </p>

            <p
              style={{
                margin: "6px 0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Clock size={16} /> Est. Wait:{" "}
              <strong>{queue.estimatedWait} mins</strong>
            </p>

            <p style={{ margin: "6px 0" }}>
              Crowd:{" "}
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: getCrowdBadgeColor(queue.crowdStatus),
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {queue.crowdStatus}
              </span>
            </p>

            {/* Alternative Counter Suggestion */}
            {queue.alternative && queue.waiting > 0 && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  background: "#f0f9ff",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#0369a1",
                }}
              >
                Tip: <strong>{queue.alternative.name}</strong> has a shorter
                wait ({queue.alternative.estimatedWait} mins).
              </div>
            )}

            <button
              disabled={queue.status !== "open"}
              onClick={() => setSelectedQueueId(queue.id)}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                background: queue.status === "open" ? "#4f46e5" : "#9ca3af",
                color: "#fff",
                fontWeight: "bold",
                cursor: queue.status === "open" ? "pointer" : "not-allowed",
              }}
            >
              {queue.status === "open" ? "Join Queue" : "Counter Closed"}
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {selectedQueue && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <form
            onSubmit={handleConfirmJoin}
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Confirm Queue Entry</h3>
            <p>
              Counter: <strong>{selectedQueue.name}</strong>
            </p>
            <p>
              People ahead: <strong>{selectedQueue.waiting}</strong>
            </p>
            <p>
              Estimated Wait:{" "}
              <strong>{selectedQueue.estimatedWait} mins</strong>
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Confirm Join
              </button>
              <button
                type="button"
                onClick={() => setSelectedQueueId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active & Past Tickets Section */}
      <h3>My Tickets</h3>
      {myLiveTickets.length === 0 ? (
        <p style={{ color: "#666" }}>
          No tickets yet. Click "Join Queue" on any counter above.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {myLiveTickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "14px 18px",
                background:
                  ticket.status === "serving"
                    ? "#ecfdf5"
                    : ticket.status === "completed"
                      ? "#f9fafb"
                      : "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Ticket size={18} />
                  <strong style={{ fontSize: "18px" }}>
                    {ticket.ticketNumber}
                  </strong>
                  <span>— {ticket.queueName}</span>
                </div>
                <div
                  style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}
                >
                  Student: {ticket.studentName}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                {ticket.status === "waiting" && (
                  <>
                    <div>
                      Position: <strong>#{ticket.position}</strong>
                    </div>
                    <div style={{ fontSize: "13px", color: "#555" }}>
                      Est. Wait: {ticket.estimatedWait} mins
                    </div>
                  </>
                )}
                {ticket.status === "serving" && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#059669",
                      fontWeight: "bold",
                    }}
                  >
                    <AlertCircle size={16} /> NOW SERVING — Proceed to Counter!
                  </span>
                )}
                {ticket.status === "completed" && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#6b7280",
                      fontWeight: "bold",
                    }}
                  >
                    <CheckCircle2 size={16} /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
