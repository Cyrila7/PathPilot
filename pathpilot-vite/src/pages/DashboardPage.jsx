import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
      >
        <span className="font-semibold text-white text-sm">{title}</span>
        <span className="text-gray-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-gray-950 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

function renderLines(lines) {
  return lines.reduce((blocks, line) => {
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.slice(4) });
    } else if (line.startsWith('- ')) {
      const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      const last = blocks[blocks.length - 1];
      if (last?.type === 'list') last.items.push(content);
      else blocks.push({ type: 'list', items: [content] });
    } else {
      const content = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      blocks.push({ type: 'p', content });
    }
    return blocks;
  }, []).map((block, i) => {
    if (block.type === 'h3') return (
      <h3 key={i} className="text-sm font-semibold text-gray-100 mt-4 mb-1">{block.content}</h3>
    );
    if (block.type === 'list') return (
      <ul key={i} className="space-y-1 pl-2 my-2">
        {block.items.map((item, j) => (
          <li key={j} className="text-gray-300 text-sm flex gap-2">
            <span className="text-blue-500 shrink-0 mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>
    );
    if (block.type === 'p') return (
      <p key={i} className="text-gray-300 text-sm leading-relaxed my-2"
        dangerouslySetInnerHTML={{ __html: block.content }} />
    );
    return null;
  });
}

function parseSections(text) {
  const sections = [];
  let current = null;

  text.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---') return;

    if (trimmed.startsWith('## ')) {
      if (current) sections.push(current);
      current = { title: trimmed.slice(3), lines: [] };
    } else if (trimmed.startsWith('# ')) {
      // skip top-level title
    } else {
      if (!current) current = { title: 'Overview', lines: [] };
      current.lines.push(trimmed);
    }
  });

  if (current) sections.push(current);
  return sections;
}

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "", email: "", major: "", school: "", gpa: "", degreeWorksText: "",
    gradeLevel: "FRESHMAN",
    careerGoal: { targetRole: "", targetCompany: "", targetDate: "" },
    skillProfile: { skillLevel: "Beginner", currentSkills: "", skillGaps: "" }
  });
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("https://pathpilot-production-de7c.up.railway.app/students/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return;
        const student = await res.json();
        setForm({
          name: student.name || "",
          email: student.email || "",
          major: student.major || "",
          school: student.school || "",
          gpa: student.gpa || "",
          degreeWorksText: student.degreeWorksText || "",
          gradeLevel: student.gradeLevel || "FRESHMAN",
          careerGoal: {
            targetRole: student.careerGoal?.targetRole || "",
            targetCompany: student.careerGoal?.targetCompany || "",
            targetDate: student.careerGoal?.targetDate || "",
          },
          skillProfile: {
            skillLevel: student.skillProfile?.skillLevel || "Beginner",
            currentSkills: student.skillProfile?.currentSkills || "",
            skillGaps: student.skillProfile?.skillGaps || "",
          }
        });
      } catch (err) {
        console.log("No existing profile found");
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleAiPlan() {
    setLoading(true);
    setError("");
    try {
      const studentRes = await fetch("https://pathpilot-production-de7c.up.railway.app/students", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (!studentRes.ok) throw new Error("Failed to save student profile.");

      const student = await studentRes.json();

      const planRes = await fetch(`https://pathpilot-production-de7c.up.railway.app/students/${student.id}/ai-plan`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!planRes.ok) throw new Error("Failed to generate AI plan.");

      const planText = await planRes.text();
      setAiPlan(planText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">PathPilot</h1>
            <p className="text-gray-400 mt-2">No sugarcoating. Just your real career roadmap.</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="space-y-3">
          <input className={inputClass} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <input className={inputClass} name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input className={inputClass} name="major" placeholder="Major" value={form.major} onChange={handleChange} />
          <input className={inputClass} name="school" placeholder="School" value={form.school} onChange={handleChange} />
          <input className={inputClass} name="gpa" placeholder="GPA (e.g. 3.7)" value={form.gpa} onChange={handleChange} />
          <textarea className={inputClass} name="degreeWorksText" placeholder="Paste your DegreeWorks audit here..." rows={6} value={form.degreeWorksText} onChange={handleChange} />
          <select className={inputClass} name="gradeLevel" value={form.gradeLevel} onChange={handleChange}>
            <option value="FRESHMAN">Freshman</option>
            <option value="SOPHOMORE">Sophomore</option>
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
          </select>

          <p className="text-gray-400 text-sm pt-2">Career Goal</p>
          <input className={inputClass} placeholder="Target Role (e.g. Software Engineer)" value={form.careerGoal.targetRole} onChange={(e) => setForm({ ...form, careerGoal: { ...form.careerGoal, targetRole: e.target.value } })} />
          <input className={inputClass} placeholder="Target Company (e.g. Google)" value={form.careerGoal.targetCompany} onChange={(e) => setForm({ ...form, careerGoal: { ...form.careerGoal, targetCompany: e.target.value } })} />
          <input className={inputClass} placeholder="Target Date (e.g. 2027)" value={form.careerGoal.targetDate} onChange={(e) => setForm({ ...form, careerGoal: { ...form.careerGoal, targetDate: e.target.value } })} />

          <p className="text-gray-400 text-sm pt-2">Skills</p>
          <input className={inputClass} placeholder="Current Skills (e.g. Java, Spring Boot)" value={form.skillProfile.currentSkills} onChange={(e) => setForm({ ...form, skillProfile: { ...form.skillProfile, currentSkills: e.target.value } })} />
          <input className={inputClass} placeholder="Skill Gaps (e.g. React, System Design)" value={form.skillProfile.skillGaps} onChange={(e) => setForm({ ...form, skillProfile: { ...form.skillProfile, skillGaps: e.target.value } })} />

          <button
            onClick={handleAiPlan}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg mt-2 transition-colors"
          >
            {loading ? "Generating your plan..." : "Generate AI Plan"}
          </button>

          {aiPlan && (
            <div className="mt-10 space-y-3">
              <h2 className="text-xl font-bold text-white mb-4">Your Career Assessment</h2>
              {parseSections(aiPlan).map((section, i) => (
                <AccordionSection key={i} title={section.title}>
                  {renderLines(section.lines)}
                </AccordionSection>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;