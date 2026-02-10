import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ProfileSection } from './ProfileSection';

interface ProfilePageProps {
  onBackToDashboard: () => void;
}

export function ProfilePage({ onBackToDashboard }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBackToDashboard}
            className="text-white hover:text-blue-100 flex items-center gap-2 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
          <p className="text-blue-100 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Profile Section */}
        <ProfileSection />
      </div>
    </div>
  );
}
