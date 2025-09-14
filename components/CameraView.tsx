
import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
            throw new Error("Camera not supported on this browser.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  if (error) {
    return (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white p-4">
            <p className="text-center mb-4">{error}</p>
            <button onClick={onClose} className="bg-zinc-700 px-4 py-2 rounded-lg">Close</button>
        </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-black flex flex-col justify-end">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="relative flex items-center justify-center p-6 bg-gradient-to-t from-black/60 to-transparent">
        <button onClick={onClose} className="absolute left-6 text-white font-semibold">
          Cancel
        </button>
        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-1.5 active:bg-zinc-200 transition-colors"
          aria-label="Take picture"
        >
          <div className="w-full h-full rounded-full border-4 border-black"></div>
        </button>
      </div>
    </div>
  );
};
