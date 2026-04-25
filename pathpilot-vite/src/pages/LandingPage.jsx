import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4">

      {/* Nav */}
      <nav className="max-w-xl mx-auto flex justify-between 
                       items-center py-6">
        <span className="text-xl font-bold tracking-tight">
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
      <div className="max-w-xl mx-auto pt-16 pb-12">
        <div className="inline-block bg-blue-950 text-blue-300 
                        text-xs font-semibold px-3 py-1 rounded-full 
                        border border-blue-800 mb-6">
          Free to use — no credit card
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight 
                       leading-tight mb-4">
          The GPS from<br />college to{" "}
          <span className="text-green-400">career.</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed 
                      mb-8 max-w-md">
          Every student. Every major. Every school. PathPilot reads 
          where you actually are, figures out what your career 
          actually requires, and hands you the exact flight plan 
          — no sugarcoating.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-500 text-white 
                       font-semibold px-7 py-3 rounded-xl 
                       transition-colors text-sm"
          >
            Get your flight plan
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-gray-400 border border-gray-700 
                       hover:text-white hover:border-gray-500 
                       px-7 py-3 rounded-xl transition-colors text-sm"
          >
            Already have an account
          </button>
        </div>
      </div>

      <hr className="max-w-xl mx-auto border-gray-800" />

      {/* Problem */}
      <div className="max-w-xl mx-auto py-12">
        <p className="text-xs font-semibold text-gray-500 
                      uppercase tracking-widest mb-3">
          The problem
        </p>
        <h2 className="text-2xl font-bold mb-2">
          Three parties. Zero alignment.
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Schools want you to graduate. Employers want you to 
          perform. You're stuck in the middle with nobody 
          translating between the two worlds.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 border border-gray-800 
                          rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase 
                          tracking-widest mb-2">Schools</p>
            <p className="text-sm font-semibold mb-2">
              Graduation rates
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Designed to get you a diploma — not a job.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 
                          rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase 
                          tracking-widest mb-2">Employers</p>
            <p className="text-sm font-semibold mb-2">
              Proof you perform
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              They hire people who contribute on day one.
            </p>
          </div>
          <div className="bg-gray-900 border border-green-900 
                          rounded-xl p-4">
            <p className="text-xs text-green-600 uppercase 
                          tracking-widest mb-2">You</p>
            <p className="text-sm font-semibold text-green-400 mb-2">
              No map
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              PathPilot fixes this.
            </p>
          </div>
        </div>
      </div>

      <hr className="max-w-xl mx-auto border-gray-800" />

      {/* Status system */}
      <div className="max-w-xl mx-auto py-12">
        <p className="text-xs font-semibold text-gray-500 
                      uppercase tracking-widest mb-3">
          Your status
        </p>
        <h2 className="text-2xl font-bold mb-2">
          Behind. On track. Ahead.
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          The three words every student needs to hear — honestly. 
          Not to make you feel good. To tell you the truth so 
          you can act on it.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-950 border border-red-900 
                          rounded-xl p-4">
            <p className="text-sm font-bold text-red-400 mb-2">
              Behind
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Missing critical skills or deadlines. Here's 
              exactly how to fix it.
            </p>
          </div>
          <div className="bg-yellow-950 border border-yellow-900 
                          rounded-xl p-4">
            <p className="text-sm font-bold text-yellow-400 mb-2">
              On track
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Doing what needs doing. PathPilot flags what's 
              coming so you stay there.
            </p>
          </div>
          <div className="bg-green-950 border border-green-900 
                          rounded-xl p-4">
            <p className="text-sm font-bold text-green-400 mb-2">
              Ahead
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Exceeding requirements. Pushed toward higher 
              opportunities.
            </p>
          </div>
        </div>
      </div>

      <hr className="max-w-xl mx-auto border-gray-800" />

      {/* No sugarcoating */}
      <div className="max-w-xl mx-auto py-12">
        <p className="text-xs font-semibold text-gray-500 
                      uppercase tracking-widest mb-3">
          No sugarcoating. Ever.
        </p>
        <div className="bg-gray-900 border border-gray-800 
                        rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase 
                            tracking-widest mb-3">
                What other AI says
              </p>
              {[
                `"You're doing great! Keep it up!"`,
                `"Here are some general tips for your journey."`,
                `"Consider internships when you feel ready."`,
                `"Your GPA shows dedication — employers love that!"`,
              ].map((line, i) => (
                <p key={i} className="text-xs text-gray-500 
                                      py-2 border-b border-gray-800 
                                      leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            <div>
              <p className="text-xs text-green-600 uppercase 
                            tracking-widest mb-3">
                What PathPilot says
              </p>
              {[
                `"You are 6 months behind. Here are the 3 specific things causing it."`,
                `"You need these 3 skills. In this order. Starting this week."`,
                `"Applications close in 47 days. You are not ready yet. Here's the sprint."`,
                `"Your GPA is not what's holding you back. Your missing portfolio is."`,
              ].map((line, i) => (
                <p key={i} className="text-xs text-gray-200 
                                      py-2 border-b border-gray-800 
                                      leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="max-w-xl mx-auto border-gray-800" />

      {/* Quote */}
      <div className="max-w-xl mx-auto py-12">
        <p className="text-xs font-semibold text-gray-500 
                      uppercase tracking-widest mb-4">
          Built by someone who lived it
        </p>
        <div className="border-l-4 border-green-500 pl-5 
                        bg-gray-900 rounded-r-xl py-5 pr-5">
          <p className="text-gray-300 text-sm leading-relaxed italic">
            "I transferred to a new school with no guide. New 
            DegreeWorks. New requirements. Credits that didn't 
            transfer right. Nobody told me what mattered, what 
            carried over, or where I was going. PathPilot is 
            the tool I needed and didn't have."
          </p>
          <p className="text-gray-500 text-xs mt-3">
            — Cyril, transfer student & builder of PathPilot
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-xl mx-auto mb-16">
        <div className="bg-gray-900 border border-gray-800 
                        rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            Get your honest<br />flight plan.
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Free. No credit card. Takes 2 minutes.<br />
            Find out exactly where you stand.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-500 text-white 
                       font-semibold px-8 py-3 rounded-xl 
                       transition-colors text-sm"
          >
            Get started free
          </button>
          <p className="text-gray-500 text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer hover:underline"
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