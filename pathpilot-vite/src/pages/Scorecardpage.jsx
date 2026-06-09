import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function parseStatus(text) {
  const line = (text || "").split("\n").find(l => l.trim().startsWith("STATUS:"));
  return line ? line.replace("STATUS:", "").trim() : "ON TRACK";
}

function parseNextMoves(text) {
  const lines = (text || "").split("\n");
  const moves = [];
  let inSection1 = false;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("## 1.")) { inSection1 = true; continue; }
    if (t.startsWith("## 2.")) break;
    if (!inSection1) continue;
    if (/^\d\./.test(t) || t.startsWith("- ")) {
      const clean = t.replace(/^\d\.\s*/, "").replace(/^- /, "").replace(/\*\*(.+?)\*\*/g, "$1");
      if (clean.length > 10) moves.push(clean);
    }
  }
  return moves.slice(0, 3);
}

function estimateScore(planText, status) {
  let hash = 0;
  for (let i = 0; i < planText.length; i++) {
    hash = (hash * 31 + planText.charCodeAt(i)) & 0xffffffff;
  }
  const abs = Math.abs(hash);
  if (status === "AHEAD") return 78 + (abs % 12);
  if (status === "ON TRACK") return 55 + (abs % 18);
  return 35 + (abs % 18);
}

const STATUS_CONFIG = {
  BEHIND: { color: "#ef4444", bg: "#450a0a", border: "#7f1d1d", label: "BEHIND" },
  "ON TRACK": { color: "#22c55e", bg: "#052e16", border: "#166534", label: "ON TRACK" },
  AHEAD: { color: "#22c55e", bg: "#052e16", border: "#166534", label: "AHEAD" },
};

function ScoreRing({ score, color }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={radius} fill="none" stroke="#21262d" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={radius}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 48 48)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function ScoreCardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const cardRef = useRef(null);

  const [student, setStudent] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, plansRes] = await Promise.all([
          fetch("https://pathpilot-production-de7c.up.railway.app/students/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://pathpilot-production-de7c.up.railway.app/students/me/plans", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!profileRes.ok) { navigate("/login"); return; }
        const profileData = await profileRes.json();
        setStudent(profileData);
        if (plansRes.ok) {
          const plans = await plansRes.json();
          if (plans.length > 0) setPlan(plans[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.origin + "/scorecard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const planText = plan?.planText || "";
  const status = parseStatus(planText);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["ON TRACK"];
  const score = plan?.score || estimateScore(planText, status);
  const moves = parseNextMoves(planText);
  const target = student?.careerGoal?.targetRole
    ? `${student.careerGoal.targetCompany?.replace(/\s*\(.*?\)\s*$/, "") || ""} · ${student.careerGoal.targetRole}`
    : "SWE Intern";
  const school = student?.school || "";
  const major = student?.major || "";
  const gpa = student?.gpa ? `GPA ${student.gpa}` : "";
  const year = student?.gradeLevel
    ? student.gradeLevel.charAt(0) + student.gradeLevel.slice(1).toLowerCase()
    : "";
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-12"
      style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Back */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          ← Back to dashboard
        </button>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        style={{
          width: "400px",
          background: "#0d1117",
          borderRadius: "16px",
          border: "1px solid #21262d",
          padding: "32px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            PathPilot
          </span>
          <span style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "1px", textTransform: "uppercase" }}>
            Readiness Score
          </span>
        </div>

        {/* Score + Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
          <div style={{ position: "relative", width: "96px", height: "96px", flexShrink: 0 }}>
            <ScoreRing score={score} color={cfg.color} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: "10px", color: "#8b949e" }}>/100</span>
            </div>
          </div>

          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              borderRadius: "6px", padding: "4px 10px", marginBottom: "8px",
            }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: cfg.color, letterSpacing: "0.5px" }}>
                {cfg.label}
              </span>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#8b949e" }}>Target</p>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#fff" }}>{target}</p>
          </div>
        </div>

        {/* Next 3 Moves */}
        {moves.length > 0 && (
          <div style={{ borderTop: "1px solid #21262d", paddingTop: "16px", marginBottom: "20px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#8b949e", letterSpacing: "1px", textTransform: "uppercase" }}>
              Top 3 moves right now
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {moves.map((move, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{
                    width: "18px", height: "18px",
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700, color: cfg.color,
                    flexShrink: 0, marginTop: "1px",
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, fontSize: "12px", color: "#c9d1d9", lineHeight: 1.5 }}>
                    {move.length > 100 ? move.slice(0, 100) + "..." : move}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "1px solid #21262d", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#8b949e" }}>
              {school} · {major} · {year}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#8b949e" }}>
              {gpa} · {month}
            </p>
          </div>
          <span style={{ fontSize: "11px", color: cfg.color, fontWeight: 600 }}>
            pathpilot.app →
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-md mt-6 space-y-3">
        <button
          onClick={handleCopyLink}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-colors"
        >
          {copied ? "✓ Link copied!" : "Copy shareable link"}
        </button>
        <p className="text-center text-xs text-gray-600">
          Screenshot this card and share it — anyone who sees it can check their own score at pathpilot.app
        </p>
      </div>

    </div>
  );
}

export default ScoreCardPage;