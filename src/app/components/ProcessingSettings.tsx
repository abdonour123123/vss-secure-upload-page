import { useState } from 'react';
import { Lock, Zap, Eye, EyeOff, Info, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ProcessingSettingsProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  onBack: () => void;
  onProcess: (settings: ProcessingConfig) => void;
}

interface ProcessingConfig {
  compress: boolean;
  encrypt: boolean;
  password?: string;
  outputFileName: string;
}

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ enabled, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${enabled ? 'bg-blue-600' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

export function ProcessingSettings({ 
  fileName, 
  fileSize, 
  fileType, 
  onBack, 
  onProcess 
}: ProcessingSettingsProps) {
  const [encryptEnabled, setEncryptEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [compressEnabled, setCompressEnabled] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCompressionReduction = () => {
    if (!compressEnabled) return 0;
    // Simulate compression reduction (30-50%)
    return 0.4;
  };

  const getEstimatedSize = () => {
    if (!compressEnabled) return fileSize;
    return Math.round(fileSize * (1 - getCompressionReduction()));
  };

  const handleSaveSettings = () => {
    const config: ProcessingConfig = {
      encrypt: encryptEnabled,
      password: encryptEnabled ? password : undefined,
      compress: compressEnabled,
      outputFileName: fileName
    };
    onProcess(config);
  };

  const handleReset = () => {
    setEncryptEnabled(false);
    setPassword('');
    setCompressEnabled(false);
  };

  const canProceed = !encryptEnabled || (encryptEnabled && password.trim().length >= 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Settings</h1>
            <p className="text-gray-600">
              Choose how your files should be processed before saving.
            </p>
          </div>

          {/* File Info Preview */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 truncate">{fileName}</p>
                <p className="text-sm text-gray-600">{formatFileSize(fileSize)}</p>
              </div>
              {compressEnabled && (
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">After compression</p>
                  <p className="text-sm text-gray-600">{formatFileSize(getEstimatedSize())}</p>
                </div>
              )}
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-6 mb-8">
            {/* Encryption Option */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Encryption</h3>
                    <p className="text-sm text-gray-600">Encrypt files for secure storage.</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={encryptEnabled}
                  onChange={setEncryptEnabled}
                />
              </div>

              {/* Password Input */}
              {encryptEnabled && (
                <div className="mt-4 pl-12 space-y-3 animate-in fade-in duration-200">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      Using AES-256 encryption. Password must be at least 6 characters.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Encryption Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a strong password"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {password && password.length < 6 && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Password must be at least 6 characters
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Compression Option */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Compression</h3>
                    <p className="text-sm text-gray-600">
                      Compress files to save space and speed up upload/download.
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={compressEnabled}
                  onChange={setCompressEnabled}
                />
              </div>

              {/* Size Reduction Preview */}
              {compressEnabled && (
                <div className="mt-4 pl-12 animate-in fade-in duration-200">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-800">
                      <span className="font-semibold">Expected size reduction:</span> ~{Math.round(getCompressionReduction() * 100)}%
                      <br />
                      <span className="text-green-700">
                        From {formatFileSize(fileSize)} to {formatFileSize(getEstimatedSize())}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Both Selected Note */}
            {encryptEnabled && compressEnabled && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 animate-in fade-in duration-200">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Processing Order</p>
                  <p className="text-sm text-blue-800">
                    Files will be first encrypted, then compressed.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 hover:bg-gray-100 transition-colors"
            >
              Reset to Default
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Settings
            </Button>
          </div>

          {/* Error Message */}
          {encryptEnabled && !canProceed && (
            <div className="mt-4 text-center">
              <p className="text-sm text-amber-600 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please enter a valid encryption password to continue
              </p>
            </div>
          )}

          {/* Cancel Link */}
          <div className="mt-4 text-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
            >
              Cancel and go back
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
