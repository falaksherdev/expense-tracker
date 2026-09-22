import { useState } from "react";
import ChangePasswordSection from "../components/ChangePasswordSection";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import PreferencesForm from "../components/PreferencesForm";
import DeleteAccountSection from "../components/DeleteAccountSection";

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="font-serif text-xl sm:text-2xl text-text mb-1">
          Settings
        </h1>
        <p className="text-dim text-xs sm:text-sm mb-6 sm:mb-8">
          Manage your account and preferences
        </p>

        {savedMessage && (
          <div className="bg-sage/10 border border-sage/30 text-sage text-sm rounded-lg px-4 py-3 mb-6">
            Preferences saved
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="mb-3">
              <h2 className="text-muted text-xs uppercase tracking-wide">
                Tracking preferences
              </h2>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
              <PreferencesForm
                initialPreferences={user?.preferences}
                onSaved={handleSaved}
                submitLabel="Save changes"
              />
              <p className="text-dim text-xs mt-4">
                Turning a feature off only hides it from the "Add Transaction"
                form. Existing data you've already added will still show on your
                dashboard.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h2 className="text-muted text-xs uppercase tracking-wide">
                Account & security
              </h2>
            </div>
            <ChangePasswordSection />
          </div>
        </div>

        {/* Delete Account — always full width */}
        <div className="mb-3">
          <h2 className="text-muted text-xs uppercase tracking-wide">
            Danger zone
          </h2>
        </div>
        <DeleteAccountSection />
      </div>
    </AppLayout>
  );
}
