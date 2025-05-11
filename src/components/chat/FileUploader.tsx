
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  uploadProgress: number;
  disabled: boolean;
}

const FileUploader = ({ onFileUpload, isUploading, uploadProgress, disabled }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleUploadClick}
        disabled={disabled}
        className="border border-5CD8B1/50 text-5CD8B1 hover:bg-5CD8B1/20"
        title="Upload file"
      >
        <Upload size={18} />
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        className="hidden"
      />
      
      {isUploading && (
        <div className="w-full space-y-2 mt-2">
          <Progress value={uploadProgress} className="h-2 bg-gray-800 border border-5CD8B1/20">
            <div 
              className="h-full bg-5CD8B1 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </Progress>
          <span className="text-xs text-5CD8B1/70">Uploading: {uploadProgress}%</span>
        </div>
      )}
    </>
  );
};

export default FileUploader;
