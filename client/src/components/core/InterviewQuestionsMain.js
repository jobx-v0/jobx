import React, { useState, useEffect } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import {
  fetchInterviewQuestions,
  addInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion,
} from "../../api/questionApi"; // Import the API functions for questions
import QuestionPostMain from "./QuestionsPostMain"; // Create a similar component for displaying interview questions
import AddQuestionModal from "./AddQuestionModal"; // Create a similar modal component for adding/editing questions
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext
import FormAction from "../FormAction";

export default function InterviewQuestionsMain() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authToken } = useAuth(); // Get the authToken from the AuthContext
  const { userInfo } = useAuth();

  useEffect(() => {
    // Fetch questions from the backend when the component mounts or when currentPage changes
    fetchQuestionsFromApi();
  }, [authToken, searchQuery, currentPage]);

  useEffect(() => {
    if (questionData) {
      onOpen();
    }
  }, [questionData, onOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuestionData(null);
    }
  }, [isOpen]);

  const fetchQuestionsFromApi = async () => {
    try {
      setLoading(true); // Set loading state to true before making a request
      const response = await fetchInterviewQuestions(
        authToken,
        currentPage,
        searchQuery
      );

      setQuestions(response.questions);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false); // Set loading state to false after the request is completed
    }
  };

  const handleAddQuestion = async (newQuestionData) => {
    try {
      await addInterviewQuestion(authToken, newQuestionData); // Pass authToken to addQuestion function
      fetchQuestionsFromApi();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleUpdateQuestion = async (updatedQuestionData) => {
    try {
      await updateInterviewQuestion(
        authToken,
        questionData._id.toString(),
        updatedQuestionData
      ); // Pass authToken to updateQuestion function
      fetchQuestionsFromApi();
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleEdit = (id) => {
    console.log("Editing question with id:", id);
    const question = questions.find(
      (question) => question._id.toString() === id
    );
    setQuestionData(question);
    onOpen();
  };

  const handleDelete = async (id) => {
    console.log("Deleting question with id:", id);
    try {
      await deleteInterviewQuestion(authToken, id); // Pass authToken to deleteQuestion function
      fetchQuestionsFromApi();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleSearchChange = (event) => {
    setCurrentPage(1);
    setSearchQuery(event.target.value);
  };

  const handleLoadPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleLoadNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
        <h1 className="text-md font-bold mb-4 text-gray-600 mt-1">All Interview Questions</h1>
        <input
            type="text"
            placeholder="Search Questions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="ml-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72" // Increase the width of the search bar by adding 'w-72' class
          />
        </div>
        {userInfo?.role === "admin" && (
          <div className="flex justify-end mb-2  ">
            <FormAction handleClick={onOpen} text="Add Question" width="auto" padding = '10px 20px' />
          </div>
        )}

        

        <AddQuestionModal
          isOpen={isOpen}
          onClose={onClose}
          onAddQuestion={handleAddQuestion}
          initialQuestionData={questionData}
          onUpdateQuestion={handleUpdateQuestion}
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {questions.map((question, index) => (
              <QuestionPostMain
                key={index}
                id={question._id.toString()}
                category={question.category}
                subCategory={question.sub_category}
                question={question.question}
                skills={question.skills}
                handleDelete={userInfo?.role === "admin" ? handleDelete : null}
                handleEdit={userInfo?.role === "admin" ? handleEdit : null}
              />
            ))}

            {totalPages > 1 && (
              <div className="pagination-buttons flex justify-between">
                <FormAction handleClick={handleLoadPrevPage} disabled={currentPage === 1} text="Previous page" width="auto" padding = '10px 20px' />
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <FormAction handleClick={handleLoadNextPage} disabled={currentPage === totalPages} text="Next page" width="auto" padding = '10px 20px' />
              </div>
            )}

          </>
        )}
      </div>
    </>
  );
}
