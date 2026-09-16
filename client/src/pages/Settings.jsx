import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import PreferencesForm from "../components/PreferencesForm";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaved = (updatedUser) => {
    setUser(updatedUser);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="font-serif text-2xl text-text mb-1">Settings</h1>
        <p className="text-dim text-sm mb-6">Manage what you track</p>

        {savedMessage && (
          <div className="bg-sage/10 border border-sage/30 text-sage text-sm rounded-lg px-4 py-3 mb-4">
            Preferences saved
          </div>
        )}

        <div className="bg-surface border border-border rounded-2xl p-6">
          <PreferencesForm
            initialPreferences={user?.preferences}
            onSaved={handleSaved}
            submitLabel="Save changes"
          />
          <p className="text-dim text-xs mt-4">
            Turning a feature off only hides it from the "Add Transaction" form.
            Existing data you've already added will still show on your
            dashboard.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
