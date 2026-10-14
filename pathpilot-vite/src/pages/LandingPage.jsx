import { Link } from "react-router-dom";

const stages = [
  { number: "01", title: "Academic audit", detail: "Student-provided DegreeWorks text and career goals" },
  { number: "02", title: "Java parser", detail: "Spring Boot extracts course statuses and alternative requirements" },
  { number: "03", title: "AI assessment", detail: "Claude generates recommendations; SSE streams the response" },
  { number: "04", title: "Validated result", detail: "Completed assessments are checked before PostgreSQL persistence" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-5">
      <nav className="max-w-5xl mx-auto py-6 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">PathPilot</Link>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href="https://github.com/Cyrila7/PathPilot" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">GitHub</a>
          <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
          <Link to="/register" className="text-blue-400 hover:text-blue-300">Get started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto pt-20 pb-16">
        <p className="inline-block rounded-full border border-blue-800 bg-blue-950 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-300 mb-7">Full-stack software engineering portfolio project</p>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mb-6">Academic planning meets <span className="text-blue-400">AI-powered career guidance.</span></h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mb-8">
          PathPilot is a React and Java Spring Boot application that interprets DegreeWorks-style academic audits
          and generates course and internship preparation recommendations using Claude.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/demo" className="rounded-xl bg-blue-600 hover:bg-blue-500 px-7 py-3.5 font-semibold transition-colors">Explore read-only demo →</Link>
          <a href="https://github.com/Cyrila7/PathPilot" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-700 hover:border-gray-500 px-7 py-3.5 font-semibold transition-colors">View source code</a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto border-t border-gray-800 py-14">
        <p className="text-blue-400 uppercase text-xs font-bold tracking-widest mb-3">How it works</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-7">From degree audit to actionable guidance</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map(stage => (
            <div key={stage.number} className="rounded-xl bg-gray-900 border border-gray-800 p-5">
              <p className="font-mono text-blue-400 text-sm mb-4">{stage.number}</p>
              <h3 className="font-bold mb-2">{stage.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{stage.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto border-t border-gray-800 py-14">
        <p className="text-blue-400 uppercase text-xs font-bold tracking-widest mb-3">Engineering overview</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-5">Built across the full stack</h2>
        <p className="text-gray-400 max-w-3xl leading-relaxed mb-6">
          React handles the student workflow and streaming UI. Spring Boot handles authentication, academic text parsing,
          assessment validation, and integration with the Claude API. PostgreSQL stores completed assessments.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {["React", "Vite", "Java 17", "Spring Boot", "PostgreSQL", "Claude API", "SSE", "JUnit"].map(tech => (
            <span key={tech} className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300">{tech}</span>
          ))}
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="font-bold mb-2">Want to try the live application?</h3>
          <div className="rounded-lg border border-gray-700 bg-gray-950 p-4 mb-5 text-sm">
              <p className="font-semibold text-white mb-3">
                Recruiter Demo Access
              </p>
              <p className="text-gray-400 mb-1">
                Email: demo@pathpilot.com
              </p>
              <p className="text-gray-400">
                Password: demo123
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Shared account — please use fictional data only.
              </p>
            </div>
          <p className="text-gray-400 text-sm mb-4">The read-only demo needs no account. A separate shared demo login is provided for exploring authenticated features.</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/demo" className="text-blue-400 font-semibold hover:text-blue-300">Explore sample assessment →</Link>
            <Link to="/login" className="text-gray-200 font-semibold hover:text-white">Open login →</Link>
          </div>
        </div>
      </section>
      <footer className="max-w-5xl mx-auto border-t border-gray-800 py-7 text-gray-500 text-sm">PathPilot · Software engineering portfolio project · <a href="https://github.com/Cyrila7/PathPilot" className="hover:text-white" target="_blank" rel="noopener noreferrer">Source on GitHub</a></footer>
    </main>
  );
}
