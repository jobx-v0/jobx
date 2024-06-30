import axios from "axios";

const API_URL = "http://localhost:3004/api/openai";

export const evaluateInterview = async (authToken) => {
  return axios.get(`${API_URL}/evaluate`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
