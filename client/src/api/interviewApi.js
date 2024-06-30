import axios from "axios";

const API_URL = "http://localhost:3004/api/interview";
// const BACKEND_URL = 'https://jobx-32a058281844.herokuapp.com';
// const API_URL = `${BACKEND_URL}/api/interview`;

export const fetchQuestions = async (authToken) => {
  return axios.get(`${API_URL}/questions`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const createInterview = async (
  authToken,
  userId,
  jobId,
  questionIds
) => {
  return axios.post(
    `${API_URL}/create-interview`,
    { user_id: userId, job_id: jobId, question_ids: questionIds },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const submitInterview = async (authToken, userId, jobId) => {
  return axios.post(
    `${API_URL}/submit-interview`,
    { userId, jobId },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};
