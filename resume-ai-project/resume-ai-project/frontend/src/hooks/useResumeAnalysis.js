import { useState, useCallback } from 'react';
import { uploadResume } from '../utils/api';

export const useResumeAnalysis = () => {
  const [state, setState] = useState({
    loading: false,
    result: null,
    error: null,
    stage: null, // 'uploading' | 'parsing' | 'analyzing' | 'done'
  });

  const analyze = useCallback(async (file, jobRole) => {
    setState({ loading: true, result: null, error: null, stage: 'uploading' });

    try {
      setTimeout(() => setState(s => ({ ...s, stage: 'parsing' })), 800);
      setTimeout(() => setState(s => ({ ...s, stage: 'analyzing' })), 2000);

      const { data } = await uploadResume(file, jobRole);

      setState({ loading: false, result: data, error: null, stage: 'done' });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Analysis failed';
      setState({ loading: false, result: null, error: message, stage: null });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, result: null, error: null, stage: null });
  }, []);

  return { ...state, analyze, reset };
};
