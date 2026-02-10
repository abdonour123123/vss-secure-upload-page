import { useState, useCallback } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps = {}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit';
    }
    return null;
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, status: 'success' as const, progress: 100 } : f
          )
        );
      } else {
        setFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const uploadedFiles: UploadedFile[] = fileArray.map(file => {
      const error = validateFile(file);
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      
      if (error) {
        return {
          id,
          file,
          status: 'error' as const,
          progress: 0,
          error
        };
      }

      return {
        id,
        file,
        status: 'uploading' as const,
        progress: 0
      };
    });

    setFiles(prev => [...prev, ...uploadedFiles]);

    // Simulate upload for valid files
    uploadedFiles.forEach(uploadedFile => {
      if (uploadedFile.status === 'uploading') {
        simulateUpload(uploadedFile.id);
      }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-4 rounded-full transition-colors
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <p className="text-lg mb-2">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click the button below to browse
            </p>
          </div>

          <label htmlFor="file-input">
            <Button type="button" onClick={() => document.getElementById('file-input')?.click()}>
              Browse Files
            </Button>
          </label>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept={ALLOWED_FILE_TYPES.join(',')}
          />

          <div className="text-xs text-gray-400 mt-2">
            <p>Supported: Images, PDF, DOC, TXT, ZIP</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Uploaded Files</h3>
          {files.map(uploadedFile => (
            <Card key={uploadedFile.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg shrink-0
                  ${uploadedFile.status === 'success' ? 'bg-green-100' : 
                    uploadedFile.status === 'error' ? 'bg-red-100' : 'bg-blue-100'}
                `}>
                  {uploadedFile.status === 'success' ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : uploadedFile.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <File className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{uploadedFile.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(uploadedFile.id)}
                      className="p-1 hover:bg-gray-100 rounded-full shrink-0"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {uploadedFile.status === 'uploading' && (
                    <div className="space-y-1">
                      <Progress value={uploadedFile.progress} className="h-2" />
                      <p className="text-xs text-gray-500">Uploading... {uploadedFile.progress}%</p>
                    </div>
                  )}

                  {uploadedFile.status === 'success' && (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-green-600">Upload complete</p>
                      {onFileSelect && (
                        <Button
                          size="sm"
                          onClick={() => onFileSelect(uploadedFile.file)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Process File
                        </Button>
                      )}
                    </div>
                  )}

                  {uploadedFile.status === 'error' && (
                    <p className="text-sm text-red-600">{uploadedFile.error}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
