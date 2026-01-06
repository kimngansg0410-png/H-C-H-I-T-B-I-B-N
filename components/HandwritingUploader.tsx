
import React, { useRef } from 'react';

interface Props {
  onImageSelect: (base64: string) => void;
  disabled: boolean;
}

const HandwritingUploader: React.FC<Props> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`w-full max-w-md aspect-video border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all
          ${disabled ? 'bg-gray-100 border-gray-300' : 'bg-white border-yellow-400 hover:bg-yellow-50 hover:border-yellow-500'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mb-2 ${disabled ? 'text-gray-400' : 'text-yellow-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className={`text-lg font-bold ${disabled ? 'text-gray-400' : 'text-yellow-600'}`}>
          {disabled ? 'Đang đọc bài...' : 'Bấm vào đây để gửi ảnh bài viết nhé!'}
        </p>
        <p className="text-sm text-gray-500">Hoặc kéo ảnh vào đây</p>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        disabled={disabled}
      />
    </div>
  );
};

export default HandwritingUploader;
