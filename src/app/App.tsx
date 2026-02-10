import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { FileUpload } from "./components/FileUpload";
import { ProcessingSettings } from "./components/ProcessingSettings";
import { ProfilePage } from "./components/ProfilePage";
import { CompletePage } from "./components/CompletePage";
import { Shield, LogOut, User } from "lucide-react";
import { Button } from "./components/ui/button";

type Page = "upload" | "processing" | "complete" | "profile";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState<Page>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setCurrentPage("upload");
    setSelectedFile(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCurrentPage("processing");
  };

  const handleProcessingBack = () => {
    setCurrentPage("upload");
  };

  const handleProcessingStart = (settings: any) => {
    console.log("Processing file with settings:", settings);
    // Simulate processing
    setTimeout(() => {
      setCurrentPage("complete");
    }, 1500);
  };

  const handleProcessAnother = () => {
    setSelectedFile(null);
    setCurrentPage("upload");
  };

  const handleViewProfile = () => {
    setCurrentPage("profile");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("upload");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentPage === "processing" && selectedFile) {
    return (
      <ProcessingSettings
        fileName={selectedFile.name}
        fileSize={selectedFile.size}
        fileType={selectedFile.type}
        onBack={handleProcessingBack}
        onProcess={handleProcessingStart}
      />
    );
  }

  if (currentPage === "profile") {
    return <ProfilePage onBackToDashboard={handleBackToDashboard} />;
  }

  if (currentPage === "complete" && selectedFile) {
    return (
      <CompletePage
        fileName={selectedFile.name}
        onProcessAnother={handleProcessAnother}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Secure File Upload</h1>
              <p className="text-gray-600">Welcome, {username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleViewProfile}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Security Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium">File Type Validation</p>
                <p className="text-sm text-gray-600">
                  Only approved file types are accepted
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium">Size Restrictions</p>
                <p className="text-sm text-gray-600">
                  Files are limited to 10MB maximum
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium">Client-side Validation</p>
                <p className="text-sm text-gray-600">
                  Instant feedback before upload starts
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium">Drag & Drop Support</p>
                <p className="text-sm text-gray-600">
                  Easy and intuitive file selection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
