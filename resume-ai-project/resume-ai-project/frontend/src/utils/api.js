import axios from 'axios';

const API = axios.create({
  baseURL: '/api/resume',
  timeout: 60000,
});

export const uploadResume = (file, jobRole) => {
  const form = new FormData();
  form.append('file', file);
  form.append('jobRole', jobRole);
  return API.post('/full-analysis', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const analyzeText = (resumeText, jobRole) =>
  API.post('/analyze', { resumeText, jobRole });

export default API;
