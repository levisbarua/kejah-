import { useState } from 'react';
import { api } from '../services/api';

export const useStorage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    setProgress(0);
    setError(null);
    setUrl(null);

    try {
      // Pass setProgress callback to get real updates from Firebase Storage
      const uploadedUrl = await api.storage.uploadImage(file, (progress) => {
        setProgress(Math.round(progress));
      });

      setProgress(100);
      setUrl(uploadedUrl);
      return uploadedUrl;
    } catch (err: any) {
      setError(err.message);
      setProgress(0);
      throw err;
    }
  };

  return { progress, error, url, uploadFile };
};
