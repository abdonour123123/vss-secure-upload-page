import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Download, Upload, LogOut, QrCode } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CompletePageProps {
  fileName: string;
  onProcessAnother: () => void;
  onLogout: () => void;
}

/**
 * CompletePage Component
 *
 * Displays after successful file processing with:
 * - Success message
 * - QR code for file access (with smooth animation)
 * - Download QR code button
 * - Action buttons to process another file or logout
 */
export function CompletePage({
  fileName,
  onProcessAnother,
  onLogout,
}: CompletePageProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Generate placeholder URL for the processed file
  const fileUrl = `https://files.example.com/download/${fileName}`;

  /**
   * Download QR code as PNG image
   * Converts SVG to canvas, then to downloadable PNG
   */
  const handleDownloadQR = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) return;

    // Create canvas to convert SVG to PNG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // Fill with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qr-code-${fileName}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center">
        {/* Success Icon with animation */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-[scale-in_0.4s_ease-out]">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-2">Processing Complete!</h1>
        <p className="text-gray-600 mb-8">
          Your file has been successfully processed and is ready for download.
        </p>

        {/* QR Code Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Scan to Access File
            </h2>
          </div>

          {/* QR Code with fade-in animation */}
          <div
            ref={qrCodeRef}
            className="flex justify-center mb-4 animate-[fade-in-scale_0.6s_ease-out_0.2s_both]"
          >
            <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
              <QRCodeSVG
                value={fileUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* File URL Display */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <p className="text-xs font-medium text-emerald-900 mb-1">
              File URL
            </p>
            <p className="text-sm text-emerald-700 break-all font-mono">
              {fileUrl}
            </p>
          </div>

          {/* Download QR Button */}
          <Button
            onClick={handleDownloadQR}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-2 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onProcessAnother}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Process Another File
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </Card>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-scale {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
