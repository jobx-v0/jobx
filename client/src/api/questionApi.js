import axios from "axios";

const API_URL = "http://localhost:3004/api/";

export const fetchInterviewQuestions = async (
  authToken,
  page = 1,
  searchQuery = "",
  limit = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/questions?`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        search: searchQuery,
        page: page,
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    throw error;
  }
};

export const addInterviewQuestion = async (authToken, newQuestionData) => {
  try {
    await axios.post(`${API_URL}/questions`, newQuestionData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error adding interview question:", error);
    throw error;
  }
};

export const updateInterviewQuestion = async (
  authToken,
  id,
  updatedQuestionData
) => {
  try {
    await axios.put(`${API_URL}/questions/${id}`, updatedQuestionData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error updating interview question:", error);
    throw error;
  }
};

export const deleteInterviewQuestion = async (authToken, id) => {
  try {
    await axios.delete(`${API_URL}/questions/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error deleting interview question:", error);
    throw error;
  }
};
