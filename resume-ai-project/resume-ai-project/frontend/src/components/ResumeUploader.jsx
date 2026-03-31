import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const JOB_ROLES = [
  'Senior Java Developer',
  'Full Stack Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'Frontend Developer',
  'Backend Developer',
  'Machine Learning Engineer',
  'Cloud Architect',
  'Software Engineer',
];

export default function ResumeUploader({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
  });

  const handleSubmit = () => {
    if (file && !loading) onAnalyze(file, jobRole);
  };

  return { file, jobRole, setJobRole, getRootProps, getInputProps, isDragActive, handleSubmit, JOB_ROLES };
}
