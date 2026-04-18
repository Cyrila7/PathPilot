import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    name: "", email: "", major: "", school: "", gpa: "",
    careerGoal: { targetRole: "", targetCompany: "", targetDate: "" },
    skillProfile: { skillLevel: "Beginner", currentSkills: "", skillGaps: "" }
  });
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAiPlan() {
    setLoading(true);
    const studentRes = await fetch("http://localhost:8080/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const student = await studentRes.json();
    const planRes = await fetch(`http://localhost:8080/students/${student.id}/ai-plan`, {
      method: "POST"
    });
    const planText = await planRes.text();
    setAiPlan(planText);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">PathPilot</h1>
          <p className="text-gray-400 mt-2">No sugarcoating. Just your real career roadmap.</p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" name="name" placeholder="Full Name" onChange={handleChange} />
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" name="email" placeholder="Email" onChange={handleChange} />
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" name="major" placeholder="Major" onChange={handleChange} />
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" name="school" placeholder="School" onChange={handleChange} />
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" name="gpa" placeholder="GPA (e.g. 3.7)" onChange={handleChange} />

          <p className="text-gray-400 text-sm pt-2">Career Goal</p>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Target Role (e.g. Software Engineer)" onChange={(e) => setForm({...form, careerGoal: {...form.careerGoal, targetRole: e.target.value}})} />
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Target Company (e.g. Google)" onChange={(e) => setForm({...form, careerGoal: {...form.careerGoal, targetCompany: e.target.value}})} />
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Target Date (e.g. 2027)" onChange={(e) => setForm({...form, careerGoal: {...form.careerGoal, targetDate: e.target.value}})} />

          <p className="text-gray-400 text-sm pt-2">Skills</p>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Current Skills (e.g. Java, Spring Boot)" onChange={(e) => setForm({...form, skillProfile: {...form.skillProfile, currentSkills: e.target.value}})} />
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Skill Gaps (e.g. React, System Design)" onChange={(e) => setForm({...form, skillProfile: {...form.skillProfile, skillGaps: e.target.value}})} />

          <button
            onClick={handleAiPlan}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg mt-2 transition-colors"
          >
            {loading ? "Generating your plan..." : "Generate AI Plan"}
          </button>
        </div>

        {/* Result */}
        {aiPlan && (
          <div className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Your Career Assessment</h2>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
              {aiPlan}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;