
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

const FileUpload = ({ onFileUpload, acceptedTypes = ".csv,.xlsx,.xls", maxSize = 10 }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setUploadedFile(file);

    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      onFileUpload(file);
    }, 2000);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={acceptedTypes}
        />

        <div className="space-y-4">
          {uploadStatus === 'success' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-green-700 font-medium">File uploaded successfully!</p>
              <p className="text-sm text-gray-500">{uploadedFile?.name}</p>
            </motion.div>
          ) : uploadStatus === 'error' ? (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-red-700 font-medium">Upload failed</p>
              <p className="text-sm text-gray-500">File too large or invalid format</p>
            </div>
          ) : uploadStatus === 'uploading' ? (
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="h-12 w-12 text-blue-500 mb-2" />
              </motion.div>
              <p className="text-blue-700 font-medium">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FileText className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-700 font-medium">Drop your census file here</p>
              <p className="text-sm text-gray-500">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">Supports CSV, Excel files (max {maxSize}MB)</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FileUpload;
