import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FONT = { fontFamily: "Georgia, 'Times New Roman', Times, serif" };

const STEPS = [
  { num: 1, label: "Your Profile" },
  { num: 2, label: "Academic Audit" },
  { num: 3, label: "Target Role" },
  { num: 4, label: "Skills Check" },
  { num: 5, label: "Processing" },
];

const inputClass =
  "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm";

const selectClass =
  "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm";

// ─── Step 1: Profile ────────────────────────────────────────────────────────
function StepProfile({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
        <input className={inputClass} placeholder="Cyril Annoh" value={data.name} onChange={e => onChange("name", e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">School</label>
        <input className={inputClass} placeholder="NYC College of Technology" value={data.school} onChange={e => onChange("school", e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Major</label>
        <input className={inputClass} placeholder="Computer Science" value={data.major} onChange={e => onChange("major", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">GPA</label>
          <input className={inputClass} placeholder="3.8" value={data.gpa} onChange={e => onChange("gpa", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Year</label>
          <select className={selectClass} value={data.gradeLevel} onChange={e => onChange("gradeLevel", e.target.value)}>
            <option value="FRESHMAN">Freshman</option>
            <option value="SOPHOMORE">Sophomore</option>
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Academic Audit ──────────────────────────────────────────────────
function StepAudit({ data, onChange }) {
  const [mode, setMode] = useState("paste");

  const tabClass = (active) =>
    `px-4 py-2 text-sm rounded-lg font-semibold transition-colors cursor-pointer ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-900 text-gray-400 border border-gray-700 hover:text-white"
    }`;

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm leading-relaxed">
        The more accurate this is, the more honest your score will be.
      </p>
      <div className="flex gap-2">
        <button className={tabClass(mode === "paste")} onClick={() => setMode("paste")}>📋 Paste Text</button>
        <button className={tabClass(mode === "upload")} onClick={() => setMode("upload")}>📄 Upload PDF</button>
        <button className={tabClass(mode === "manual")} onClick={() => setMode("manual")}>✏️ Enter Manually</button>
      </div>

      {mode === "paste" && (
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
            Paste your DegreeWorks audit
          </label>
          <textarea
            className={inputClass}
            rows={8}
            placeholder="Open DegreeWorks → select all text → paste it here..."
            value={data.degreeWorksText}
            onChange={e => onChange("degreeWorksText", e.target.value)}
          />
        </div>
      )}

      {mode === "upload" && (
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-white font-semibold mb-1">Upload your DegreeWorks PDF</p>
          <p className="text-gray-500 text-sm mb-4">PDF files only</p>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            id="audit-upload"
            onChange={e => {
              const file = e.target.files[0];
              if (file) onChange("auditFile", file);
            }}
          />
          <label
            htmlFor="audit-upload"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer transition-colors text-sm"
          >
            Choose File
          </label>
          {data.auditFile && (
            <p className="text-blue-400 text-sm mt-3">✓ {data.auditFile.name}</p>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div className="space-y-3">
          <p className="text-gray-500 text-xs">Enter your academic info manually — this is your fallback option.</p>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Credits Completed</label>
            <input className={inputClass} placeholder="e.g. 59" value={data.creditsCompleted || ""} onChange={e => onChange("creditsCompleted", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Credits Remaining</label>
            <input className={inputClass} placeholder="e.g. 61" value={data.creditsRemaining || ""} onChange={e => onChange("creditsRemaining", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Courses Completed (comma separated)</label>
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Data Structures, Algorithms, OOP, Discrete Math..."
              value={data.coursesCompleted || ""}
              onChange={e => onChange("coursesCompleted", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Target Role ─────────────────────────────────────────────────────
function StepRole({ data, onChange }) {
  const tiers = ["FAANG / Big Tech", "Mid-size Tech", "Startup", "Any"];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Target Role</label>
        <input
          className={inputClass}
          placeholder="Software Engineer Intern"
          value={data.targetRole}
          onChange={e => onChange("targetRole", e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Target Company (optional)</label>
        <input
          className={inputClass}
          placeholder="e.g. JP Morgan, Google, any startup..."
          value={data.targetCompany}
          onChange={e => onChange("targetCompany", e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Company Tier</label>
        <div className="grid grid-cols-2 gap-2">
          {tiers.map(tier => (
            <button
              key={tier}
              onClick={() => onChange("companyTier", tier)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-colors text-left ${
                data.companyTier === tier
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Target Date</label>
        <input
          className={inputClass}
          placeholder="e.g. Summer 2027"
          value={data.targetDate}
          onChange={e => onChange("targetDate", e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── Step 4: Skills Check ────────────────────────────────────────────────────
function StepSkills({ data, onChange }) {
  const questions = [
    {
      key: "hasProjects",
      label: "Do you have GitHub projects?",
      options: ["None", "1–2 projects", "3+ projects"],
    },
    {
      key: "leetcodeLevel",
      label: "LeetCode consistency?",
      options: ["Never done it", "Done some", "Weekly practice"],
    },
    {
      key: "internshipExp",
      label: "Internship or work experience?",
      options: ["None", "1 internship", "2+ internships"],
    },
    {
      key: "dsaLevel",
      label: "Comfortable with DSA?",
      options: ["Beginner", "Intermediate", "Strong"],
    },
    {
      key: "builtEndToEnd",
      label: "Built anything end to end?",
      options: ["Not yet", "Yes — one project", "Yes — multiple"],
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-gray-400 text-sm leading-relaxed">
        Be honest — this is what makes the score accurate.
      </p>
      {questions.map(q => (
        <div key={q.key}>
          <label className="text-sm font-semibold text-white mb-2 block">{q.label}</label>
          <div className="flex flex-wrap gap-2">
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => onChange(q.key, opt)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  data[q.key] === opt
                    ? "bg-blue-600 border-blue-500 text-white font-semibold"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
          Current Skills (comma separated)
        </label>
        <input
          className={inputClass}
          placeholder="Java, Spring Boot, React, SQL..."
          value={data.currentSkills}
          onChange={e => onChange("currentSkills", e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── Step 5: Processing ──────────────────────────────────────────────────────
function StepProcessing({ streamingText }) {
  const bottomRef = React.useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingText]);

  const hasText = streamingText && streamingText.length > 0;

  return (
    <div className="py-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
        <p className="text-sm text-blue-400 font-semibold">
          {hasText ? "Generating your plan..." : "Analyzing your profile..."}
        </p>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 min-h-48 max-h-96 overflow-y-auto">
        {hasText ? (
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {streamingText}
            <span className="inline-block w-2 h-4 bg-blue-400 ml-0.5 animate-pulse" />
          </div>
        ) : (
          <div className="space-y-3">
            {["Reading your academic audit...", "Comparing against SWE requirements...", "Calculating your readiness score..."].map((msg, i) => (
              <div key={i} className="flex items-center gap-2 opacity-40">
                <span className="text-blue-500 text-xs">→</span>
                <span className="text-gray-400 text-sm">{msg}</span>
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <p className="text-gray-600 text-xs text-center">
        This takes about 20-30 seconds. You will be redirected automatically.
      </p>
    </div>
  );
}

// ─── Main Onboarding Component ───────────────────────────────────────────────
function OnboardingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const [profile, setProfile] = useState({
    name: "", school: "", major: "", gpa: "", gradeLevel: "SOPHOMORE",
  });

  const [audit, setAudit] = useState({
    degreeWorksText: "", auditFile: null, creditsCompleted: "", creditsRemaining: "", coursesCompleted: "",
  });

  const [role, setRole] = useState({
    targetRole: "Software Engineer Intern", targetCompany: "", companyTier: "Any", targetDate: "",
  });

  const [skills, setSkills] = useState({
    hasProjects: "", leetcodeLevel: "", internshipExp: "", dsaLevel: "", builtEndToEnd: "", currentSkills: "",
  });

  function updateProfile(key, val) { setProfile(p => ({ ...p, [key]: val })); }
  function updateAudit(key, val) { setAudit(a => ({ ...a, [key]: val })); }
  function updateRole(key, val) { setRole(r => ({ ...r, [key]: val })); }
  function updateSkills(key, val) { setSkills(s => ({ ...s, [key]: val })); }

  // ─── Pre-fill from existing profile ─────────────────────────────────────
  useEffect(() => {
    async function prefill() {
      try {
        const res = await fetch(
          "https://pathpilot-production-de7c.up.railway.app/students/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const s = await res.json();

        if (s.name) setProfile({
          name: s.name || "",
          school: s.school || "",
          major: s.major || "",
          gpa: s.gpa || "",
          gradeLevel: s.gradeLevel || "SOPHOMORE",
        });

        if (s.degreeWorksText) setAudit(a => ({
          ...a,
          degreeWorksText: s.degreeWorksText || "",
        }));

        if (s.careerGoal) {
          // strip the tier that was appended e.g. "JP Morgan (Any)"
          const rawCompany = s.careerGoal.targetCompany || "";
          const company = rawCompany.replace(/\s*\(.*?\)\s*$/, "");
          const tierMatch = rawCompany.match(/\((.+?)\)$/);
          const tier = tierMatch ? tierMatch[1] : "Any";
          setRole({
            targetRole: s.careerGoal.targetRole || "Software Engineer Intern",
            targetCompany: company,
            companyTier: tier,
            targetDate: s.careerGoal.targetDate || "",
          });
        }

        if (s.skillProfile) {
          // parse skillGaps back into individual keys
          const gaps = s.skillProfile.skillGaps || "";
          const extract = (key) => {
            const match = gaps.match(new RegExp(`${key}:\\s*([^,]+)`));
            return match ? match[1].trim() : "";
          };
          setSkills({
            hasProjects: extract("GitHub"),
            leetcodeLevel: extract("LeetCode"),
            internshipExp: extract("Internship"),
            dsaLevel: extract("DSA"),
            builtEndToEnd: extract("End-to-end project"),
            currentSkills: s.skillProfile.currentSkills || "",
          });
        }
      } catch (err) {
        // no profile yet — fresh start, leave defaults
      }
    }
    prefill();
  }, []);

  function validateStep() {
    if (step === 1) {
      if (!profile.name.trim()) return "Please enter your name.";
      if (!profile.school.trim()) return "Please enter your school.";
      if (!profile.major.trim()) return "Please enter your major.";
    }
    if (step === 3) {
      if (!role.targetRole.trim()) return "Please enter your target role.";
    }
    return null;
  }

  async function handleNext() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");

    if (step === 4) {
      setStep(5);
      await handleSubmit();
      return;
    }

    setStep(s => s + 1);
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const skillSummary = [
        skills.hasProjects && `GitHub: ${skills.hasProjects}`,
        skills.leetcodeLevel && `LeetCode: ${skills.leetcodeLevel}`,
        skills.internshipExp && `Internship: ${skills.internshipExp}`,
        skills.dsaLevel && `DSA: ${skills.dsaLevel}`,
        skills.builtEndToEnd && `End-to-end project: ${skills.builtEndToEnd}`,
      ].filter(Boolean).join(", ");

      const auditText = audit.degreeWorksText ||
        `Credits completed: ${audit.creditsCompleted}, Credits remaining: ${audit.creditsRemaining}, Courses: ${audit.coursesCompleted}`;

      const payload = {
        name: profile.name,
        email: "",
        major: profile.major,
        school: profile.school,
        gpa: profile.gpa,
        degreeWorksText: auditText,
        gradeLevel: profile.gradeLevel,
        careerGoal: {
          targetRole: role.targetRole,
          targetCompany: `${role.targetCompany} (${role.companyTier})`,
          targetDate: role.targetDate,
        },
        skillProfile: {
          skillLevel: skills.dsaLevel || "Beginner",
          currentSkills: skills.currentSkills,
          skillGaps: skillSummary,
        },
      };

      // check if profile exists
      const existingRes = await fetch(
        "https://pathpilot-production-de7c.up.railway.app/students/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let student;
      if (existingRes.ok) {
        const existing = await existingRes.json();
        const updateRes = await fetch(
          `https://pathpilot-production-de7c.up.railway.app/students/${existing.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          }
        );
        if (!updateRes.ok) throw new Error("Failed to update profile.");
        student = await updateRes.json();
      } else {
        const createRes = await fetch(
          "https://pathpilot-production-de7c.up.railway.app/students",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          }
        );
        if (!createRes.ok) throw new Error("Failed to create profile.");
        student = await createRes.json();
      }

      // generate plan — streaming
      setStreamingText("");
      const planRes = await fetch(
        `https://pathpilot-production-de7c.up.railway.app/students/${student.id}/ai-plan`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!planRes.ok) throw new Error("Failed to generate your plan. Please try again.");

      const reader = planRes.body.getReader();
            const decoder = new TextDecoder();

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                const text = lines
                  .filter(line => line.startsWith('data:'))
                  .map(line => line.replace(/^data:\s*/, ''))
                  .join('');
                setStreamingText(prev => prev + text);
              }
            } catch (streamErr) {
              // stream closed — plan was already saved on backend
              console.log("Stream closed:", streamErr);
            }

            // always redirect regardless of how stream ended
            localStorage.setItem("onboardingComplete", "true");
            navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setStep(4);
    } finally {
      setLoading(false);
    }
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span
            className="text-xl font-extrabold tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            PathPilot
          </span>
          <p className="text-gray-500 text-sm mt-1">
            Step {step} of {STEPS.length} — {STEPS[step - 1].label}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-10">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step labels */}
        <div className="flex justify-between mb-10">
          {STEPS.map(s => (
            <div key={s.num} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  s.num < step
                    ? "bg-blue-600 text-white"
                    : s.num === step
                    ? "bg-blue-600 text-white ring-4 ring-blue-900"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {s.num < step ? "✓" : s.num}
              </div>
              <span className={`text-xs hidden sm:block ${s.num === step ? "text-white font-semibold" : "text-gray-600"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Add your academic audit"}
            {step === 3 && "What's your target?"}
            {step === 4 && "Skills reality check"}
            {step === 5 && "Generating your score..."}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && "Basic info so we can calibrate your score."}
            {step === 2 && "The more accurate this is, the more honest your score will be."}
            {step === 3 && "Define what landing the internship looks like for you."}
            {step === 4 && "Be brutally honest — this is what makes the plan actionable."}
            {step === 5 && "Sit tight. We're building your honest readiness score."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="mb-10">
          {step === 1 && <StepProfile data={profile} onChange={updateProfile} />}
          {step === 2 && <StepAudit data={audit} onChange={updateAudit} />}
          {step === 3 && <StepRole data={role} onChange={updateRole} />}
          {step === 4 && <StepSkills data={skills} onChange={updateSkills} />}
          {step === 5 && <StepProcessing streamingText={streamingText} />}
        </div>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setError(""); setStep(s => s - 1); }}
              className={`text-sm text-gray-400 hover:text-white transition-colors ${step === 1 ? "invisible" : ""}`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              {step === 4 ? "Generate My Score →" : "Continue →"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default OnboardingPage;