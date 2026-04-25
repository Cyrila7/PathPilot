import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const majors = [
    "Nursing", "Computer Science", "Finance & Accounting",
    "Graphic Design", "Pre-Law", "Pre-Med / Biology",
    "Marketing", "Engineering", "Education", "Film & Media",
    "Psychology", "Architecture", "Chemistry",
    "Transfer Students", "Undecided"
  ];

  const steps = [
    { num: 1, title: "Your profile", desc: "School, major, and grade level" },
    { num: 2, title: "DegreeWorks", desc: "Paste your audit — AI reads it" },
    { num: 3, title: "Career goal", desc: "Type your target role in plain language" },
    { num: 4, title: "Skills check", desc: "What you can actually do right now" },
    { num: 5, title: "Your plan", desc: "Honest flight plan built for you" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6">

      {/* Nav */}
      <nav className="max-w-5xl mx-auto flex justify-between 
                       items-center py-6">
        <span className="text-xl font-extrabold tracking-tight">
          PathPilot
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-400 border border-gray-700 
                       px-4 py-2 rounded-lg hover:text-white 
                       hover:border-gray-500 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm font-semibold bg-blue-600 
                       hover:bg-blue-500 px-4 py-2 rounded-lg 
                       transition-colors"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto pt-20 pb-16 text-center">
        <div className="inline-block bg-blue-950 text-blue-300 
                        text-xs font-semibold px-4 py-1.5 
                        rounded-full border border-blue-800 mb-8 
                        tracking-wide">
          Free for all students — no credit card needed
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold 
                       tracking-tight leading-tight mb-5">
          The GPS from college<br />
          to{" "}
          <span className="text-blue-400">career.</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed 
                      max-w-xl mx-auto mb-10">
          PathPilot reads where you actually are, figures out what 
          your career actually requires, and hands you an honest 
          flight plan. No sugarcoating. Ever.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-500 text-white 
                       font-bold px-8 py-4 rounded-xl text-base 
                       transition-colors"
          >
            Get your free flight plan
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-gray-400 border border-gray-700 
                       hover:text-white hover:border-gray-500 
                       px-8 py-4 rounded-xl text-base 
                       transition-colors"
          >
            Already have an account
          </button>
        </div>
      </div>

      <hr className="max-w-5xl mx-auto border-gray-800" />

      {/* How it works */}
      <div className="max-w-5xl mx-auto py-16">
        <p className="text-xs font-bold text-blue-500 uppercase 
                      tracking-widest text-center mb-3">
          How it works
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight 
                       text-center mb-2">
          Five inputs. One honest plan.
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          No career counselor required. Takes about 2 minutes.
        </p>
        <div className="grid grid-cols-5 gap-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-blue-950 border border-blue-900 
                         rounded-xl p-4 text-center"
            >
              <div className="w-8 h-8 bg-blue-900 text-blue-300 
                              rounded-full flex items-center 
                              justify-center text-sm font-bold 
                              mx-auto mb-3">
                {step.num}
              </div>
              <p className="text-sm font-bold text-white mb-1">
                {step.title}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <hr className="max-w-5xl mx-auto border-gray-800" />

      {/* Problem */}
      <div className="max-w-5xl mx-auto py-16">
        <p className="text-xs font-bold text-blue-500 uppercase 
                      tracking-widest text-center mb-3">
          The problem
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight 
                       text-center mb-2">
          Three parties. Zero alignment.
        </h2>
        <p className="text-gray-500 text-sm text-center 
                      max-w-lg mx-auto mb-10 leading-relaxed">
          Schools want you to graduate. Employers want you to 
          perform. You're stuck in the middle with nobody 
          translating between the two worlds.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 
                          rounded-2xl p-6">
            <p className="text-xs font-bold text-gray-500 
                          uppercase tracking-widest mb-3">
              Schools optimize for
            </p>
            <p className="text-base font-bold mb-2">
              Graduation rates
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Credits, GPA, accreditation. Designed to get you 
              a diploma — not to get you employed. These are 
              not the same thing.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 
                          rounded-2xl p-6">
            <p className="text-xs font-bold text-gray-500 
                          uppercase tracking-widest mb-3">
              Employers optimize for
            </p>
            <p className="text-base font-bold mb-2">
              Proof you can perform
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Skills, portfolio, real experience. They hire people 
              who can walk in and contribute on day one.
            </p>
          </div>
          <div className="bg-blue-950 border border-blue-800 
                          rounded-2xl p-6">
            <p className="text-xs font-bold text-blue-500 
                          uppercase tracking-widest mb-3">
              PathPilot fixes this
            </p>
            <p className="text-base font-bold text-blue-400 mb-2">
              You get a map
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              PathPilot connects your coursework to your career. 
              Skill by skill. Course by course. 
              Deadline by deadline.
            </p>
          </div>
        </div>
      </div>

      <hr className="max-w-5xl mx-auto border-gray-800" />

      {/* Status system */}
      <div className="max-w-5xl mx-auto py-16">
        <p className="text-xs font-bold text-blue-500 uppercase 
                      tracking-widest text-center mb-3">
          Your status
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight 
                       text-center mb-2">
          Behind. On track. Ahead.
        </h2>
        <p className="text-gray-500 text-sm text-center 
                      max-w-lg mx-auto mb-10 leading-relaxed">
          The three words every student needs to hear honestly — 
          not to make you feel good, but so you can actually 
          do something about it.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-950 border border-red-900 
                          rounded-2xl p-6">
            <p className="text-base font-extrabold text-red-400 mb-3">
              Behind
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Missing critical skills or deadlines. A warning — 
              not a judgment. PathPilot tells you exactly 
              how to fix it.
            </p>
            <div className="bg-red-900 bg-opacity-30 rounded-lg 
                            p-3 font-mono text-xs text-red-300 
                            leading-relaxed">
              ⚠ 8 months behind<br />
              ✗ Missing: portfolio, internship<br />
              → Prioritize these NOW
            </div>
          </div>
          <div className="bg-blue-950 border border-blue-900 
                          rounded-2xl p-6">
            <p className="text-base font-extrabold text-blue-400 mb-3">
              On track
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              You're doing what needs to be done. PathPilot flags 
              what's coming up so you don't fall behind 
              without noticing.
            </p>
            <div className="bg-blue-900 bg-opacity-30 rounded-lg 
                            p-3 font-mono text-xs text-blue-300 
                            leading-relaxed">
              ✓ Skills baseline met<br />
              ~ 2 gaps to close by Fall<br />
              → Apply to internships now
            </div>
          </div>
          <div className="bg-green-950 border border-green-900 
                          rounded-2xl p-6">
            <p className="text-base font-extrabold text-green-400 mb-3">
              Ahead
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              You're exceeding what your career requires right now. 
              PathPilot pushes you toward higher-level 
              opportunities you're ready for early.
            </p>
            <div className="bg-green-900 bg-opacity-30 rounded-lg 
                            p-3 font-mono text-xs text-green-300 
                            leading-relaxed">
              ✓ All core skills covered<br />
              ✓ Portfolio strong<br />
              → Target these companies now
            </div>
          </div>
        </div>
      </div>

      <hr className="max-w-5xl mx-auto border-gray-800" />

      {/* No sugarcoating */}
      <div className="max-w-5xl mx-auto py-16">
        <p className="text-xs font-bold text-blue-500 uppercase 
                      tracking-widest text-center mb-3">
          No sugarcoating. Ever.
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight 
                       text-center mb-2">
          Other AI vs PathPilot.
        </h2>
        <p className="text-gray-500 text-sm text-center 
                      max-w-lg mx-auto mb-10">
          Every other tool optimizes for how you feel leaving. 
          PathPilot optimizes for where you actually end up.
        </p>
        <div className="bg-gray-900 border border-gray-800 
                        rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 divide-x 
                          divide-gray-800">
            <div className="p-6">
              <p className="text-xs font-bold text-gray-500 
                            uppercase tracking-widest mb-4">
                What other AI says
              </p>
              {[
                `"You're doing great! Keep it up!"`,
                `"Here are some general tips for your journey."`,
                `"Consider internships when you feel ready."`,
                `"Your GPA shows dedication — employers love that!"`,
              ].map((line, i) => (
                <p key={i} className="text-sm text-gray-500 
                                      py-3 border-b border-gray-800 
                                      leading-relaxed last:border-0">
                  {line}
                </p>
              ))}
            </div>
            <div className="p-6">
              <p className="text-xs font-bold text-blue-500 
                            uppercase tracking-widest mb-4">
                What PathPilot says
              </p>
              {[
                `"You are 6 months behind. Here are the 3 specific things causing it."`,
                `"You need these 3 skills. In this order. Starting this week."`,
                `"Applications close in 47 days. You are not ready yet. Here's the sprint."`,
                `"Your GPA is not what's holding you back. Your missing portfolio is."`,
              ].map((line, i) => (
                <p key={i} className="text-sm text-white 
                                      py-3 border-b border-gray-800 
                                      leading-relaxed last:border-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="max-w-5xl mx-auto border-gray-800" />

      {/* Every major */}
      <div className="max-w-5xl mx-auto py-16">
        <p className="text-xs font-bold text-blue-500 uppercase 
                      tracking-widest text-center mb-3">
          Every major
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight 
                       text-center mb-2">
          Not just for CS students.
        </h2>
        <p className="text-gray-500 text-sm text-center mb-10">
          The gap between school and career exists in every field. 
          PathPilot works for all of them.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {majors.map((major) => (
            <span
              key={major}
              className="bg-gray-900 border border-gray-800 
                         text-gray-400 text-sm px-4 py-2 
                         rounded-full"
            >
              {major}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto pb-20">
        <div className="bg-blue-950 border border-blue-900 
                        rounded-3xl p-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight 
                         mb-4">
            Get your honest<br />flight plan. Free.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed 
                        mb-10">
            Takes 2 minutes. No credit card.<br />
            Find out exactly where you stand — Behind, 
            On Track, or Ahead.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-500 text-white 
                       font-bold px-10 py-4 rounded-xl text-base 
                       transition-colors"
          >
            Get started free
          </button>
          <p className="text-gray-600 text-sm mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer 
                         hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}

export default LandingPage;