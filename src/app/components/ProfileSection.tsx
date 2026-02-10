import { useState, useCallback, useRef } from 'react';
import { Camera, X, FileText, Upload, User, Mail, AtSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ProfileData {
  fullName: string;
  username: string;
  email: string;
  bio: string;
}

interface UploadedDocument {
  id: string;
  file: File;
  preview: string;
}

const PROFILE_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip'
];

export function ProfileSection() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const [isDraggingDocs, setIsDraggingDocs] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    username: '',
    email: '',
    bio: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const profileInputRef = useRef<HTMLInputElement>(null);
  const docsInputRef = useRef<HTMLInputElement>(null);

  const validateProfileImage = (file: File): string | null => {
    if (!PROFILE_IMAGE_TYPES.includes(file.type)) {
      return 'Only PNG, JPG, JPEG, and GIF formats are allowed';
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      return 'Image size must be less than 5MB';
    }
    return null;
  };

  const handleProfileImageChange = (file: File) => {
    const error = validateProfileImage(file);
    if (error) {
      setErrors(prev => ({ ...prev, profileImage: error }));
      return;
    }

    setErrors(prev => ({ ...prev, profileImage: '' }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingProfile(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleProfileImageChange(file);
    }
  }, []);

  const handleProfileFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProfileImageChange(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  const handleDocumentsDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingDocs(false);
    const files = Array.from(e.dataTransfer.files);
    addDocuments(files);
  }, []);

  const handleDocumentsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    addDocuments(files);
  };

  const addDocuments = (files: File[]) => {
    const validFiles = files.filter(file => DOCUMENT_TYPES.includes(file.type));
    const newDocs: UploadedDocument[] = validFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: getFileIcon(file.type)
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('text')) return '📃';
    if (type.includes('zip')) return '📦';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSave = () => {
    console.log('Saving profile:', { profileData, profileImage, documents });
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setProfileData({
      fullName: '',
      username: '',
      email: '',
      bio: ''
    });
    setProfileImage(null);
    setDocuments([]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Profile Settings</h2>

        {/* Profile Picture Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div
              className="relative"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingProfile(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingProfile(false);
              }}
              onDrop={handleProfileDrop}
            >
              <div
                className={`
                  w-32 h-32 rounded-full overflow-hidden border-4 cursor-pointer
                  transition-all duration-200
                  ${isDraggingProfile ? 'border-blue-500 scale-105' : 'border-gray-200'}
                  ${!profileImage ? 'bg-gradient-to-br from-gray-100 to-gray-200' : ''}
                  hover:border-blue-400
                `}
                onClick={() => profileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {profileImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProfileImage();
                  }}
                  className="absolute -top-1 -right-1 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {!profileImage && (
                <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg">
                  <Camera className="w-5 h-5" />
                </div>
              )}

              <input
                ref={profileInputRef}
                type="file"
                accept={PROFILE_IMAGE_TYPES.join(',')}
                onChange={handleProfileFileInput}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Click or drag & drop to upload
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG, or GIF (max. 5MB)
              </p>
              {errors.profileImage && (
                <p className="text-xs text-red-500 mt-1">{errors.profileImage}</p>
              )}
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) =>
                setProfileData(prev => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AtSign className="w-4 h-4 inline mr-1" />
              Username
            </label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) =>
                setProfileData(prev => ({ ...prev, username: e.target.value }))
              }
              placeholder="johndoe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData(prev => ({ ...prev, email: e.target.value }))
              }
              placeholder="john.doe@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData(prev => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {/* Additional Documents Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Documents
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingDocs(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingDocs(false);
            }}
            onDrop={handleDocumentsDrop}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
              ${isDraggingDocs ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-gray-300 bg-gray-50'}
              hover:border-blue-400 hover:bg-blue-50 cursor-pointer
            `}
            onClick={() => docsInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${isDraggingDocs ? 'bg-blue-100' : 'bg-gray-200'}`}>
                <Upload className={`w-6 h-6 ${isDraggingDocs ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {isDraggingDocs ? 'Drop your files here' : 'Upload documents'}
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, TXT, ZIP files supported
              </p>
            </div>
            <input
              ref={docsInputRef}
              type="file"
              multiple
              accept={DOCUMENT_TYPES.join(',')}
              onChange={handleDocumentsInput}
              className="hidden"
            />
          </div>

          {/* Documents Grid */}
          {documents.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="relative group p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all bg-white"
                >
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="flex items-start gap-2">
                    <div className="text-2xl shrink-0">{doc.preview}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {doc.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.file.size)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all"
          >
            Save Changes
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 hover:bg-gray-100 transition-all"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
