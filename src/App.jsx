import React, { useState } from "react";
import { useQueues } from "./hooks/useQueues";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import { RotateCcw } from "lucide-react";

export default function App() {
  const [activePage, setActivePage] = useState("student");

  const {
    queues,
    joinQueue,
    callNext,
    completeTicket,
    toggleCounterStatus,
    resetAllQueues,
    statistics,
  } = useQueues();

  return (
    <div>
      {/* Temporary Top Navbar */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ fontWeight: "800", fontSize: "20px", color: "#4f46e5" }}>
          QueueLess
        </div>

        <nav style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setActivePage("student")}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              background: activePage === "student" ? "#4f46e5" : "#f1f5f9",
              color: activePage === "student" ? "#ffffff" : "#334155",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Student Dashboard
          </button>

          <button
            onClick={() => setActivePage("staff")}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              background: activePage === "staff" ? "#4f46e5" : "#f1f5f9",
              color: activePage === "staff" ? "#ffffff" : "#334155",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Staff Dashboard
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("queueless_my_tickets");
              resetAllQueues();
            }}
            title="Reset demo data"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#475569",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <RotateCcw size={14} /> Reset Demo
          </button>
        </nav>
      </header>

      {/* Active Dashboard */}
      <main>
        {activePage === "student" ? (
          <StudentDashboard queues={queues} onJoinQueue={joinQueue} />
        ) : (
          <StaffDashboard
            queues={queues}
            statistics={statistics}
            onCallNext={callNext}
            onCompleteTicket={completeTicket}
            onToggleCounterStatus={toggleCounterStatus}
          />
        )}
      </main>
    </div>
  );
}
