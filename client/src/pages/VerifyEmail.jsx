import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function VerifyEmail() {
  const { token } = useParams();
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const verify = async () => {
      try {
        const { data } = await axiosInstance.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(data.message);

        if (user) {
          setUser({ ...user, isVerified: true });
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Something went wrong");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 text-muted text-xs sm:text-sm tracking-wide mb-6">
          <Logo size={16} className="text-gold" />
          <span>Expense Tracker</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          {status === "verifying" && (
            <>
              <div className="w-10 h-10 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border-2 border-border" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
              </div>
              <p className="text-dim text-sm">Verifying your email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-sage"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="font-serif text-xl text-text mb-2">
                Email verified
              </h1>
              <p className="text-dim text-sm mb-6">{message}</p>
              <Link
                to={user ? "/dashboard" : "/login"}
                className="inline-block bg-gold text-ink font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
              >
                {user ? "Go to dashboard" : "Go to login"}
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rust/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-rust"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="font-serif text-xl text-text mb-2">
                Verification failed
              </h1>
              <p className="text-dim text-sm mb-6">{message}</p>
              <Link
                to="/dashboard"
                className="inline-block bg-gold text-ink font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
              >
                Go to dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
