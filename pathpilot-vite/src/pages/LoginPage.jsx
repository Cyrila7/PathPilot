import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const res = await fetch("https://pathpilot-production-de7c.up.railway.app/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    const token = await res.text();
    if (!token || token === "Invalid credentials" || !token.startsWith("ey")) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    localStorage.setItem("token", token);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">

      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-[500px] h-[500px] bg-blue-600 opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">

        {/* Logo */}
        <div className="text-center mb-10">
          <span
            onClick={() => navigate("/")}
            className="text-2xl font-black text-white cursor-pointer tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PathPilot
          </span>
          <p className="text-gray-500 text-sm mt-2">Welcome back. Let's check your progress.</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4 shadow-xl">

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Email</label>
            <input
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              placeholder="you@email.com"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1.5 block">Password</label>
            <input
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors mt-2"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </div>

        <p className="text-gray-500 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;