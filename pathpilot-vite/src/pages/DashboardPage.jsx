import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  BEHIND: {
    bg: "bg-red-950", border: "border-red-800",
    text: "text-red-400", icon: "⚠️", label: "BEHIND",
    sub: "You have significant ground to cover. Urgency required.",
  },
  "ON TRACK": {
    bg: "bg-yellow-950", border: "border-yellow-800",
    text: "text-yellow-400", icon: "📍", label: "ON TRACK",
    sub: "You're moving in the right direction. Keep pushing.",
  },
  AHEAD: {
    bg: "bg-green-950", border: "border-green-800",
    text: "text-green-400", icon: "🚀", label: "AHEAD",
    sub: "You're ahead of the curve. Don't slow down.",
  },
};

function parseStatus(text) {
  const line = (text || "").split("\n").find(l => l.trim().startsWith("STATUS:"));
  return line ? line.replace("STATUS:", "").trim() : null;
}

function parseSections(text) {
  const sections = [];
  let current = null;
  (text || "").split("\n").forEach(line => {
    const t = line.trim();
    if (!t || t === "---" || t.startsWith("STATUS:")) return;
    if (t.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: t.slice(3), lines: [] };
    } else if (t.startsWith("# ")) {
      // skip
    } else {
      if (!current) current = { title: "Overview", lines: [] };
      current.lines.push(t);
    }
  });
  if (current) sections.push(current);
  return sections;
}

function parseNextMoves(sections) {
  const actionSection = sections.find(s =>
    s.title.toLowerCase().includes("skill") ||
    s.title.toLowerCase().includes("action") ||
    s.title.toLowerCase().includes("next") ||
    s.title.toLowerCase().includes("priorit") ||
    s.title.toLowerCase().includes("recommend")
  );
  if (!actionSection) return [];
  return actionSection.lines
    .filter(l => l.startsWith("- ") || /^\d\./.test(l))
    .map(l => l.replace(/^- |^\d\.\s*/, "").replace(/\*\*(.+?)\*\*/g, "$1"))
    .slice(0, 3);
}

function renderLines(lines) {
  return lines.reduce((blocks, line) => {
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", content: line.slice(4) });
    } else if (line.startsWith("- ")) {
      const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      const last = blocks[blocks.length - 1];
      if (last?.type === "list") last.items.push(content);
      else blocks.push({ type: "list", items: [content] });
    } else {
      const content = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      blocks.push({ type: "p", content });
    }
    return blocks;
  }, []).map((block, i) => {
    if (block.type === "h3")
      return <h3 key={i} className="text-sm font-semibold text-gray-100 mt-4 mb-1">{block.content}</h3>;
    if (block.type === "list")
      return (
        <ul key={i} className="space-y-1 pl-2 my-2">
          {block.items.map((item, j) => (
            <li key={j} className="text-gray-300 text-sm flex gap-2">
              <span className="text-blue-500 shrink-0 mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );
    return (
      <p key={i} className="text-gray-300 text-sm leading-relaxed my-2"
        dangerouslySetInnerHTML={{ __html: block.content }} />
    );
  });
}

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
      >
        <span className="font-semibold text-white text-sm">{title}</span>
        <span className="text-gray-400 text-lg">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-gray-950 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score < 40 ? "#ef4444" : score < 70 ? "#eab308" : "#22c55e";
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1f2937" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="70" y="65" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Inter, sans-serif">
          {score}
        </text>
        <text x="70" y="84" textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="Inter, sans-serif">
          / 100
        </text>
      </svg>
      <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase">Readiness Score</p>
    </div>
  );
}

function estimateScore(planText) {
  const status = parseStatus(planText);
  let hash = 0;
  for (let i = 0; i < planText.length; i++) {
    hash = (hash * 31 + planText.charCodeAt(i)) & 0xffffffff;
  }
  const abs = Math.abs(hash);
  if (status === "AHEAD") return 78 + (abs % 12);
  if (status === "ON TRACK") return 55 + (abs % 18);
  return 35 + (abs % 18);
}

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [student, setStudent] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, histRes] = await Promise.all([
          fetch("https://pathpilot-production-de7c.up.railway.app/students/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://pathpilot-production-de7c.up.railway.app/students/me/plans", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!profileRes.ok) {
          navigate("/onboarding");
          return;
        }

        const profileData = await profileRes.json();
        setStudent(profileData);

        if (histRes.ok) {
          const plans = await histRes.json();
          setPlanHistory(plans);

          const justOnboarded = localStorage.getItem("onboardingComplete") === "true";
          localStorage.removeItem("onboardingComplete");

          if ((!plans || plans.length === 0) && !justOnboarded) {
            navigate("/onboarding");
            return;
          }
        }
      } catch (err) {
        setError("Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleRegenerate() {
    if (!student) return;
    setRegenerating(true);
    setError("");
    try {
      await fetch(
        `https://pathpilot-production-de7c.up.railway.app/students/${student.id}/ai-plan`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const histRes = await fetch(
        "https://pathpilot-production-de7c.up.railway.app/students/me/plans",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (histRes.ok) setPlanHistory(await histRes.json());
    } catch (err) {
      setError("Failed to regenerate plan.");
    } finally {
      setRegenerating(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const latestPlan = planHistory[0];
  const latestPlanText = latestPlan?.planText || "";
  const status = parseStatus(latestPlanText);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["BEHIND"];
  const sections = parseSections(latestPlanText);
  const nextMoves = parseNextMoves(sections);
  const score = latestPlan?.score || estimateScore(latestPlanText);
  const latestDate = latestPlan
    ? new Date(latestPlan.createdAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">PathPilot</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {student?.name ? `Welcome back, ${student.name.split(" ")[0]}.` : "Your career dashboard."}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/onboarding")}
              className="text-sm text-gray-400 border border-gray-700 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 border border-gray-700 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {latestPlan && (
          <>
            {/* Score + Status */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                <ScoreRing score={score} />
              </div>
              <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-6 flex flex-col justify-between`}>
                <div>
                  <span className="text-3xl">{cfg.icon}</span>
                  <p className={`text-xl font-extrabold mt-2 ${cfg.text}`}>{cfg.label}</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{cfg.sub}</p>
                </div>
                {latestDate && (
                  <p className="text-gray-600 text-xs mt-4">Last updated {latestDate}</p>
                )}
              </div>
            </div>

            {/* Next 3 Moves */}
            {nextMoves.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                  Your Next 3 Moves
                </p>
                <div className="space-y-3">
                  {nextMoves.map((move, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-blue-900 text-blue-300 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-300 leading-relaxed">{move}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Assessment */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Full Assessment
              </p>
              {sections.map((section, i) => (
                <AccordionSection key={i} title={section.title}>
                  {renderLines(section.lines)}
                </AccordionSection>
              ))}
            </div>

            {/* Regenerate */}
            <div className="mb-10">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {regenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "↻ Regenerate My Score"
                )}
              </button>
            </div>

            {/* Past Assessments */}
            {planHistory.length > 1 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Past Assessments
                </p>
                <div className="space-y-3">
                  {planHistory.slice(1).map(plan => {
                    const pcfg = STATUS_CONFIG[plan.status] || STATUS_CONFIG["BEHIND"];
                    const date = new Date(plan.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    });
                    const planScore = estimateScore(plan.planText || "");
                    return (
                      <AccordionSection key={plan.id} title={`${date} — ${plan.status} — Score: ${planScore}`}>
                        <div className={`${pcfg.bg} border ${pcfg.border} rounded-xl px-4 py-3 mb-4 flex items-center gap-3`}>
                          <span className="text-2xl">{pcfg.icon}</span>
                          <div>
                            <p className={`font-bold text-sm ${pcfg.text}`}>{pcfg.label}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{pcfg.sub}</p>
                          </div>
                        </div>
                        {parseSections(plan.planText).map((section, j) => (
                          <AccordionSection key={j} title={section.title}>
                            {renderLines(section.lines)}
                          </AccordionSection>
                        ))}
                      </AccordionSection>
                    );
                  })}
                </div>
              </div>
            )}

            {planHistory.length === 1 && (
              <p className="text-gray-600 text-xs text-center pb-6">
                Regenerate your score to start tracking progress over time.
              </p>
            )}
          </>
        )}

        {!latestPlan && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No plan generated yet.</p>
            <button
              onClick={() => navigate("/onboarding")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Generate My Score
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default DashboardPage;