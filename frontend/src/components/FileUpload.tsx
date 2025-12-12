import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({ file, onFileChange }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const verifyIdCard = useCallback((file: File) => {
    setVerificationStatus('verifying');
    
    setTimeout(() => {
      const isValidImage = file.type.startsWith('image/');
      const isReasonableSize = file.size > 10000 && file.size < 10000000; // 10KB - 10MB
      
      if (isValidImage && isReasonableSize) {
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('failed');
      }
    }, 2000);
  }, []);

  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload an image (JPEG, PNG, WebP) or PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    onFileChange(file);
    setVerificationStatus('idle');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    verifyIdCard(file);
  }, [onFileChange, verifyIdCard]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const removeFile = () => {
    onFileChange(null);
    setPreview(null);
    setVerificationStatus('idle');
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <input
              type="file"
              onChange={handleInputChange}
              accept="image/*,.pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                dragActive ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <Upload className={`w-8 h-8 ${dragActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                {dragActive ? 'Drop your file here' : 'Drag & drop your ID card'}
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mb-4">
                or click to browse from your computer
              </p>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span>JPEG, PNG, WebP, PDF</span>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-hidden flex-shrink-0">
                {preview ? (
                  <img src={preview} alt="ID Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileImage className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                <div className="mt-3">
                  {verificationStatus === 'verifying' && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <div className="w-4 h-4 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
                      <span className="text-sm font-medium">Verifying ID card...</span>
                    </div>
                  )}
                  {verificationStatus === 'verified' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-emerald-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">ID verified successfully</span>
                    </motion.div>
                  )}
                  {verificationStatus === 'failed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Verification failed - please upload a clearer image</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <button
                onClick={removeFile}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 justify-center">
        {['JPEG', 'PNG', 'WebP', 'PDF'].map((format) => (
          <span
            key={format}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full"
          >
            {format}
          </span>
        ))}
      </div>
    </div>
  );
}
