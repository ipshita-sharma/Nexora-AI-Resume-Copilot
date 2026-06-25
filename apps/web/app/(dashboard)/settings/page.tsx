import { ProfileSettings } from "@/components/workflows/profile-settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Profile and preferences</p>
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <ProfileSettings />
    </div>
  );
}
