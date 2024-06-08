import axios from "axios";

const API_URL = "http://localhost:3004/api/";
export const fetchJobs = async (
  authToken,
  searchQuery = "",
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/jobs`, {
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
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const addJob = async (authToken, newJobData) => {
  try {
    await axios.post(`${API_URL}/jobs`, newJobData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

export const updateJob = async (authToken, id, updatedJobData) => {
  try {
    await axios.put(`${API_URL}/jobs/${id}`, updatedJobData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (authToken, id) => {
  try {
    await axios.delete(`${API_URL}/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
