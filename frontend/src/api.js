import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const analyzeResume = async (file, jd) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jd", jd);
  try {
    const response = await axios.post(`${BASE_URL}/analyze`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    return { error: err?.response?.data?.error || "Server error" };
  }
};

export const enhanceBullet = async (bullet) => {
  try {
    const response = await axios.post(`${BASE_URL}/enhance`, { bullet });
    return response.data;
  } catch (err) {
    return { error: err?.response?.data?.error || "Server error" };
  }
};

export const improveFullResume = async (resume_text) => {
  try {
    const response = await axios.post(`${BASE_URL}/improve-full`, {
      resume_text,
    });
    return response.data;
  } catch (err) {
    return { error: err?.response?.data?.error || "Server error" };
  }
};
