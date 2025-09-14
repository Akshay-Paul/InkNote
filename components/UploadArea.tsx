
import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  onOpenCamera: () => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, onOpenCamera }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-10">
      <div className="bg-blue-100 rounded-full p-6 mb-6">
        <Camera className="text-blue-500" size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-zinc-800 mb-2">Scan Your Notes</h2>
      <p className="text-zinc-500 mb-8 max-w-xs">
        Convert your handwritten to-do list into categorized tasks instantly.
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <button
        onClick={onOpenCamera}
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Take Photo
      </button>
       <button
        onClick={handleUploadClick}
        className="mt-4 text-blue-500 font-semibold"
      >
        or upload a file
      </button>
    </div>
  );
};
