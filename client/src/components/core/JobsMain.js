import React, { useState, useEffect } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { fetchJobs, addJob, updateJob, deleteJob } from "../../api/jobApi";
import JobPostMain from "./JobPostMain";
import AddJobModal from "./AddJobModal";
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext
import FormAction from "../FormAction";
export default function JobsMain() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authToken } = useAuth(); // Get the authToken from the AuthContext
  const { userInfo } = useAuth();

  useEffect(() => {
    // Fetch jobs from the backend when the component mounts
    fetchJobsFromApi();
  }, [authToken, searchQuery, currentPage]);

  useEffect(() => {
    if (jobData) {
      onOpen();
    }
  }, [jobData, onOpen]);

  useEffect(() => {
    if (!isOpen) {
      setJobData(null);
    }
  }, [isOpen]);

  const fetchJobsFromApi = async () => {
    try {
      const data = await fetchJobs(authToken, searchQuery, currentPage); // Pass authToken, searchQuery, and currentPage to fetchJobs function
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const handleAddJob = async (newJobData) => {
    try {
      await addJob(authToken, newJobData); // Pass authToken to addJob function
      fetchJobsFromApi();
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleUpdateJob = async (updatedJobData) => {
    try {
      await updateJob(authToken, jobData._id.toString(), updatedJobData); // Pass authToken to updateJob function
      fetchJobsFromApi();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleEdit = (id) => {
    console.log("Editing job with id:", id);
    const job = jobs.find((job) => job._id.toString() === id);
    setJobData(job);
    onOpen();
  };

  const handleDelete = async (id) => {
    console.log("Deleting job with id:", id);
    try {
      await deleteJob(authToken, id); // Pass authToken to deleteJob function
      fetchJobsFromApi();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
  };

  const handleLoadPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1); // Update currentPage state
  };

  const handleLoadNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Update currentPage state
  };

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-md font-bold mb-4 text-gray-600 mt-1">All Jobs</h1>
          <input
            type="text"
            placeholder="Search Jobs..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72" // Increase the width of the search bar by adding 'w-72' class
          />
        </div>
        {userInfo?.role === "admin" && (
          <div className="flex justify-end mb-2">
            <FormAction handleClick={onOpen} text="Add Job" width="auto" padding = '10px 20px' />
          </div>
        )}
        

        {loading ? (
          <p>Loading...</p>
        ) : jobs.length > 0 ? (
          jobs.map((job, index) => (
            <JobPostMain
              key={index}
              id={job._id.toString()}
              title={job.title}
              jobLink={job.job_link}
              companyLogoUrl={job.company_logo}
              company={job.company_name}
              description={job.description}
              location={job.location}
              employmentType={job.employment_type}
              yearsOfExperience={job.experience_required}
              skills={job.skills_required}
              handleDelete={userInfo?.role === "admin" ? handleDelete : null}
              handleEdit={userInfo?.role === "admin" ? handleEdit : null}
            />
          ))
        ) : (
          <p>No jobs found.</p>
        )}
        
        {totalPages > 1 && (
            <div className="pagination-buttons flex justify-between">
    
            <FormAction handleClick={handleLoadPrevPage} disabled={currentPage === 1} text="Previous page" width="auto" padding = '10px 20px' />
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <FormAction handleClick={handleLoadNextPage} disabled={currentPage === totalPages} text="Next page" width="auto" padding = '10px 20px' />
          </div>
        )}

        <AddJobModal
          isOpen={isOpen}
          onClose={onClose}
          onAddJob={handleAddJob}
          initialJobData={jobData}
          onUpdateJob={handleUpdateJob}
        />
      </div>
    </>
  );
}
