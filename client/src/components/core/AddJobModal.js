import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Button,
} from "@nextui-org/react";
import StringList from "./StringListInput";

const AddJobModal = ({ isOpen, onClose, onAddJob, initialJobData, onUpdateJob }) => {
  const [jobData, setJobData] = useState(
    initialJobData || {
      title: "",
      description: "",
      job_link: "",
      employment_type: "",
      location: "",
      skills_required: [],
      experience_required: 0,
      company_name: "",
      company_logo: "",
    }
  );

  useEffect(() => {
    if (initialJobData) {
      setJobData(initialJobData);
    }
  }, [initialJobData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateJob = () => {
    if (initialJobData) {
      // Editing existing job
      // Call a different function to update the job
      // For now, we'll just log the updated job data
      console.log("Updated job data:", jobData);
      onUpdateJob(jobData);
    } else {
      // Adding new job
      // Call the onAddJob function passed from parent component
      onAddJob(jobData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setJobData({
      title: "",
      description: "",
      job_link: "",
      employment_type: "",
      location: "",
      skills_required: [],
      experience_required: 0,
      company_name: "",
      company_logo: "",
    });
    onClose();
  };

  const handleAddSkillList = (newList) => {
    setJobData((prevObject) => ({
      ...prevObject,
      skills_required: newList,
    }));
  };

  const handleRadioChange = (value) => {
    setJobData((prevData) => ({
      ...prevData,
      employment_type: value,
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
          <h1 className="text-sm font-semibold text-gray-500 mb-2">
            {initialJobData ? "Edit Job" : "Add Job"}
          </h1>
        </ModalHeader>
        <ModalBody>
          <Input
            label="Company Name"
            variant="flat"
            name="company_name"
            value={jobData.company_name}
            onChange={handleChange}
            placeholder="Company Name"
          />
          <Input
            label="Title"
            variant="flat"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            placeholder="Job Title"
          />
          <Textarea
            label="Description"
            variant="flat"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            placeholder="Job Description"
          />
          <Input
            label="Job Link"
            variant="flat"
            name="job_link"
            value={jobData.job_link}
            onChange={handleChange}
            placeholder="Job Link"
          />
          <Input
            label="Years of Experience Required"
            variant="flat"
            name="experience_required"
            value={jobData.experience_required}
            onChange={handleChange}
            placeholder="Years of Experience Required"
          />
          <Input
            label="Location"
            variant="flat"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            placeholder="Remote/On-site"
          />
          <Input
            label="Company Logo Url"
            variant="flat"
            name="company_logo"
            value={jobData.company_logo}
            onChange={handleChange}
            placeholder="Company Logo Url"
          />
          <StringList
            stringList={jobData.skills_required}
            setStringList={handleAddSkillList}
            placeholder="Skills required"
            label="Skills required"
          />
          <RadioGroup
            style={{ marginLeft: "10px" }}
            label={<span style={{ fontSize: "12px" }}>Employment Type</span>}
            value={jobData.employment_type}
            onValueChange={handleRadioChange}
            orientation="horizontal"
          >
            <Radio value="full-time">Full-time</Radio>
            <Radio value="part-time">Part-time</Radio>
            <Radio value="intern">Intern</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleAddOrUpdateJob}>
            {initialJobData ? "Update Job" : "Add Job"}
          </Button>
          <Button ghost onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddJobModal;
