
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Copy, Download, RefreshCw } from 'lucide-react';

const QRRegistration = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [registrationUrl, setRegistrationUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = () => {
    setIsGenerating(true);
    
    // Generate a unique registration URL
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const url = `https://elab-hub.com/register?code=${uniqueId}`;
    setRegistrationUrl(url);
    
    // Generate QR code (using a placeholder for now)
    setTimeout(() => {
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationUrl);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'registration-qr-code.png';
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">QR Code Registration</h3>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <button
            onClick={generateQRCode}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4" />
                Generate QR Code
              </>
            )}
          </button>
        </div>

        {qrCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <img 
                  src={qrCode} 
                  alt="Registration QR Code" 
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={registrationUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={downloadQR}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download QR
                </button>
                <button
                  onClick={generateQRCode}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Share this QR code with new users</li>
                <li>• Users scan the code to access the registration form</li>
                <li>• The registration link is valid for 30 days</li>
                <li>• Track registrations in the user management section</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QRRegistration;
