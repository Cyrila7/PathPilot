import { Link } from "react-router-dom";

const courses = [
  { code: "CST 2309", name: "Web Programming I", status: "Still needed" },
  { code: "MAT 2440", name: "Discrete Mathematics", status: "In progress" },
  { code: "CST 1204", name: "Database Fundamentals", status: "Grade recorded" },
  { code: "MAT 2540 / MAT 1475", name: "Mathematics requirement", status: "Choose one" },
];

export default function RecruiterDemoPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <Link to="/" className="text-xl font-bold">PathPilot</Link>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://github.com/Cyrila7/PathPilot" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">GitHub</a>
            <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </div>
        </header>

        <span className="inline-flex rounded-full border border-blue-800 bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-300 mb-4">
          Read-only demo · Fictional student · No API calls
        </span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Explore PathPilot</h1>
        <p className="text-gray-400 leading-relaxed max-w-2xl mb-10">
          A sample of how PathPilot turns a DegreeWorks-style academic audit into structured course statuses
          and AI-guided academic and internship recommendations. This is illustrative sample output, not a live assessment.
        </p>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-5">
          <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-4">Example student profile</p>
          <div className="grid sm:grid-cols-3 gap-5">
            <div><p className="text-gray-500 text-xs mb-1">Student</p><p className="font-semibold">Alex Morgan (fictional)</p></div>
            <div><p className="text-gray-500 text-xs mb-1">Major</p><p className="font-semibold">Computer Systems</p></div>
            <div><p className="text-gray-500 text-xs mb-1">Goal</p><p className="font-semibold">Software Engineering Internship</p></div>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-5">
          <h2 className="text-xl font-bold mb-2">1. Parsed academic audit</h2>
          <p className="text-sm text-gray-400 mb-5">Illustrative parser output: course status detection and an alternative requirement.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="border-b border-gray-700 text-gray-400"><th className="py-3 pr-4">Course</th><th className="py-3 pr-4">Description</th><th className="py-3">Status</th></tr></thead>
              <tbody>{courses.map(course => (
                <tr key={course.code} className="border-b border-gray-800 last:border-0">
                  <td className="py-3 pr-4 font-mono text-blue-300 whitespace-nowrap">{course.code}</td>
                  <td className="py-3 pr-4 text-gray-300">{course.name}</td>
                  <td className="py-3 text-gray-300 whitespace-nowrap">{course.status}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">A recorded grade does not automatically establish that a course was passed.</p>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-5">
          <h2 className="text-xl font-bold mb-5">2. Example assessment</h2>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Top priorities</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Finish an end-to-end Java/Spring Boot project and document API endpoints.</li>
                <li>Practice data structures and algorithms consistently.</li>
                <li>Prepare an internship resume and begin tracking applications.</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Skills to learn first</p>
              <p className="text-gray-300">REST API design, SQL queries, unit testing, and Java collections.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Internship preparation timeline</p>
              <p className="text-gray-300">First month: strengthen backend fundamentals. Next month: complete a project and practice interviews. Continue applications throughout the recruiting cycle.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Recommended next-semester courses</p>
              <p className="text-gray-300">CST 2309 (still needed); MAT 2540 or MAT 1475 (choose one).</p>
              <p className="text-gray-500 mt-2 text-xs">Confirm prerequisites and availability with an academic advisor.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">How the real application works</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            The React frontend sends student inputs to a Java Spring Boot API. A DegreeWorks text parser extracts
            course statuses; the backend provides those facts to Claude to generate an assessment. Responses stream
            back to the frontend, and validated results are stored in PostgreSQL.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {["React", "Java 17", "Spring Boot", "PostgreSQL", "Claude API", "SSE streaming"].map(t => (
              <span key={t} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-xs text-gray-300">{t}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/Cyrila7/PathPilot" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 rounded-lg px-5 py-3 font-semibold text-sm">View source code</a>
            <Link to="/login" className="border border-gray-700 hover:border-gray-500 rounded-lg px-5 py-3 font-semibold text-sm">Sign in to live app</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
