import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PreferencesForm from "../components/PreferencesForm";

export default function Onboarding() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSaved = (updatedUser) => {
    setUser(updatedUser);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-muted text-sm tracking-wide mb-2">
            Expense Tracker
          </div>
          <h1 className="font-serif text-2xl text-text font-semibold">
            Welcome, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-dim text-sm mt-2">
            Pick what you want to track. You can change this later in settings.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xl shadow-black/20">
          <PreferencesForm
            initialPreferences={user?.preferences}
            onSaved={handleSaved}
            submitLabel="Continue to dashboard"
          />
        </div>
      </div>
    </div>
  );
}
