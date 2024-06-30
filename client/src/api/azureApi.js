import axios from "axios";

const API_URL = "http://localhost:3004/api/azure";

export const transcribeInterview = async (authToken, userId, jobId) => {
  return axios.post(`${API_URL}/transcribe`, {
    body: {
      userId: userId,
      jobId: jobId,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
