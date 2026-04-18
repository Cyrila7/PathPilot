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
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>PathPilot</h1>
      <p>No sugarcoating. Just your real career roadmap.</p>

      <input name="name" placeholder="Full Name" onChange={handleChange} /><br/>
      <input name="email" placeholder="Email" onChange={handleChange} /><br/>
      <input name="major" placeholder="Major" onChange={handleChange} /><br/>
      <input name="school" placeholder="School" onChange={handleChange} /><br/>
      <input name="gpa" placeholder="GPA" onChange={handleChange} /><br/>

      <h3>Career Goal</h3>
      <input name="targetRole" placeholder="Target Role" onChange={(e) => setForm({...form, careerGoal: {...form.careerGoal, targetRole: e.target.value}})} /><br/>
      <input name="targetCompany" placeholder="Target Company" onChange={(e) => setForm({...form, careerGoal: {...form.careerGoal, targetCompany: e.target.value}})} /><br/>
      <input name="targetDate" placeholder="Target Date (e.g. 2027)" onChange={(e) => setForm({...form, careerGoal: {...form.careerGoal, targetDate: e.target.value}})} /><br/>

      <h3>Skills</h3>
      <input name="currentSkills" placeholder="Current Skills (e.g. Java, Spring Boot)" onChange={(e) => setForm({...form, skillProfile: {...form.skillProfile, currentSkills: e.target.value}})} /><br/>
      <input name="skillGaps" placeholder="Skill Gaps (e.g. React, System Design)" onChange={(e) => setForm({...form, skillProfile: {...form.skillProfile, skillGaps: e.target.value}})} /><br/>

      <button onClick={handleAiPlan} disabled={loading}>
        {loading ? "Generating..." : "Generate AI Plan"}
      </button>

      {aiPlan && (
        <div style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
          <h2>Your AI Career Assessment</h2>
          {aiPlan}
        </div>
      )}
    </div>
  );
}

export default App;