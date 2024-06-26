import React, { useState, useEffect, useRef } from "react";
import {
  fetchQuestions,
  submitInterview,
  evaluateInterview,
} from "../api/interviewApi";
import QuestionDisplay from "../components/interview/QuestionDisplay";
import QuestionCategoryModal from "../components/interview/QuestionTypeModal";
import SubmitIntervieModal from "../components/interview/SubmitInterviewModal";
import Nav from "../components/core/Nav";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Flex } from "@tremor/react";
import { Chip, Button, Tooltip, useDisclosure } from "@nextui-org/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import "../components/interview/interview.css";
import VideoRecorder from "../components/VideoRecorder";

const InterviewPage = () => {
  var { authToken, setToken, userInfo, fetchUserInfo } = useAuth();
  const [questions, setQuestions] = useState({});
  const [questionIds, setQuestionIds] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();
  const [isQuestionPrevMoved, setQuestionPrevMoved] = useState(false);
  const {
    isOpen: isSubmitModalOpen,
    onOpen: onOpenSubmitModal,
    onClose: onCloseSubmitModal,
  } = useDisclosure();
  const [isTimerActive, setIsTimerActive] = useState(true);

  const handleTimerActiveChange = (newTimerActiveValue) => {
    setIsTimerActive(newTimerActiveValue);
  };

  useEffect(() => {
    console.log("inside useeffect interview");
    // If there is no authToken in the context, retrieve it from localStorage
    const storedAuthToken = localStorage.getItem("authToken");
    if (storedAuthToken) {
      setToken(storedAuthToken);
      // Fetch user info from the backend
      fetchUserInfo(storedAuthToken);

      // Fetch questions from the backend when the component mounts
      fetchQuestions(storedAuthToken)
        .then((response) => {
          const questionsResponse = response.data.Questions;
          // store the ids in questionIds
          questionsResponse.map((question) => {
            setQuestionIds((questionIds) => [...questionIds, question._id]);
          });

          setQuestions(questionsResponse);
          setUserAnswers(Array(questionsResponse.length).fill(""));
          console.log(response.data);
        })
        .catch((error) => {
          // Handle errors, such as redirecting on authorization failure
          console.error("Error fetching questions:", error);
          navigate("/login");
        });
    } else {
      // Redirect to login if no authToken found
      navigate("/login");
      return;
    }
  }, []);

  const handleNextQuestion = () => {
    console.log("Next button clicked: ", currentQuestionIndex);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionPrevMoved(false);
    }
  };

  const handleSubmit = () => {
    console.log("Submit button clicked");

    // Construct the interview data
    const interviewData = questions.map((questionObj, index) => ({
      question: questionObj.question,
      answer: userAnswers[index],
    }));

    // Send a POST request to the backend to store the interview data
    submitInterview(authToken, interviewData)
      .then((response) => {
        console.log("Interview data submitted successfully:", response);
        navigate("/thank-you");
      })
      .catch((error) => {
        console.error("Error submitting interview data:", error);
        // Handle the error, such as displaying an error message
      });

    // Call evaluate API with chatGPT
    evaluateInterview(authToken)
      .then((response) => {
        console.log("Evaluation from Chat-GPT: ", response);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("Evaluation feature is currently disabled.");
          // Optionally redirect or display a message to the user
          // TODO: Display a notification bar
        } else {
          console.error("Error during evaluation:", error);
          // Handle other types of errors
        }
      });
  };

  const questionsCount = questions.length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex flex-col items-center justify-center">
      <Nav isInterviewPage={true} isLandingPage={false} />
      <div className="bg-white m-3 p-2 lg:p-4 rounded-xl shadow-xl border-1 border-slate-50 max-w-6xl w-11/12  lg:w-full flex flex-col ">
        <Flex className="gap-4 p-0 py-1 mb-3 w-full justify-between">
          {" "}
          <div>
            <Chip
              variant="shadow"
              classNames={{
                base: "border-gray/50 border-1 rounded-lg bg-white shadow-slate-200/30",
                content: "text-slate-500 font-normal py-1 text-xs lg:text-sm",
              }}
            >
              {" "}
              Question{" "}
              <span style={{ letterSpacing: "1.6px" }}>
                {currentQuestionIndex + 1}/{questionsCount}
              </span>
            </Chip>
          </div>
          <div>
            <QuestionCategoryModal
              type={
                questions[currentQuestionIndex]
                  ? questions[currentQuestionIndex].type
                  : ""
              }
            />
          </div>
        </Flex>

        <QuestionDisplay
          question={
            questions[currentQuestionIndex]
              ? questions[currentQuestionIndex].question
              : ""
          }
          skipAnimate={isQuestionPrevMoved}
          currentQuestionIndex={currentQuestionIndex}
        />

        <VideoRecorder
          questionId={questionIds[currentQuestionIndex]}
          onTimerActiveChange={handleTimerActiveChange}
          userId={userInfo._id}
        />

        {!isTimerActive ? (
          <Flex className="gap-4 p-0 py-1 mt-3 w-full justify-end">
            <div>
              <Tooltip
                showArrow={true}
                content={isLastQuestion ? "Submit Interview" : "Next Question"}
                placement="bottom"
              >
                <Button
                  size="sm"
                  className=" py-6 lg:p-8 text-md w-0 lg:w-auto lg:text-lg font-medium border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-1"
                  onPress={
                    isLastQuestion ? onOpenSubmitModal : handleNextQuestion
                  }
                >
                  {isLastQuestion ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} size="lg" />
                    </>
                  ) : (
                    <FontAwesomeIcon icon={faArrowRight} size="lg" />
                  )}
                </Button>
              </Tooltip>
            </div>
          </Flex>
        ) : (
          <></>
        )}
        <SubmitIntervieModal
          isSubmitModalOpen={isSubmitModalOpen}
          onOpenSubmitModal={onOpenSubmitModal}
          onCloseSubmitModal={onCloseSubmitModal}
          handleSubmit={handleSubmit}
        />
      </div>
      <footer className="text-center text-gray-500 text-xs mt-4">
        <p>&copy; 2024 Job-X</p>
      </footer>
    </div>
  );
};

export default InterviewPage;
