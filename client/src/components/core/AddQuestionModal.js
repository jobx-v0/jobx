import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Button,
} from "@nextui-org/react";
import StringList from "./StringListInput"; // Import StringList component
import {
  addInterviewQuestion,
  updateInterviewQuestion,
} from "../../api/interviewApi";

const AddQuestionModal = ({
  isOpen,
  onClose,
  onAddQuestion,
  initialQuestionData,
  onUpdateQuestion,
}) => {
  const [questionData, setQuestionData] = useState(
    initialQuestionData || {
      question: "",
      category: "",
      skills: [],
    }
  );

  useEffect(() => {
    if (initialQuestionData) {
      setQuestionData(initialQuestionData);
    }
  }, [initialQuestionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateQuestion = () => {
    if (initialQuestionData) {
      onUpdateQuestion(questionData);
    } else {
      onAddQuestion(questionData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setQuestionData({
      question: "",
      category: "",
      skills: [],
    });
    onClose();
  };

  const handleAddSkillList = (newList) => {
    setQuestionData((prevObject) => ({
      ...prevObject,
      skills: newList,
    }));
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[calc(100vh-40px)] overflow-y-auto"
    >
      <ModalContent>
        <ModalHeader>
          <h1 className="text-xl font-bold text-black mb-2">
            {initialQuestionData ? "Edit Question" : "Add Question"}
          </h1>
        </ModalHeader>
        <ModalBody>
          <Input
            label="Question"
            variant="flat"
            name="question"
            value={questionData.question}
            onChange={handleChange}
            placeholder="Enter question"
          />
          <Input
            label="Category"
            variant="flat"
            name="category"
            value={questionData.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
          <StringList
            stringList={questionData.skills}
            setStringList={handleAddSkillList}
            placeholder="Enter skills"
            label="Skills"
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleAddOrUpdateQuestion}>
            {initialQuestionData ? "Update Question" : "Add Question"}
          </Button>
          <Button ghost onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddQuestionModal;
