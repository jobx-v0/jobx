import { Button } from "@nextui-org/react";
import { Locate, Luggage, Crown, Trash2, Pencil } from "lucide-react";
import { useDisclosure } from "@nextui-org/react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModel from "./DeleteConfirmationModal";
import StartInterviewModal from "../home/StartInterviewModal";
import NewInterview from "../../views/NewInterview";
import FormAction from "../FormAction";
import {Chip} from "@nextui-org/chip";

const SkillTag = ({ skill }) => {
  return (
    <div className="inline-block text-sm  rounded-medium border-1 border-gray-200 bg-zinc-0 px-3 py-1 mr-2  cursor-pointer">
      <span className="text-gray-500">{skill}</span>
    </div>
  );
};

export default function JobPostMain({
  id,
  title,
  jobLink,
  company,
  companyLogoUrl,
  description,
  location,
  employmentType,
  yearsOfExperience,
  skills,
  handleDelete,
  handleEdit,
}) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo } = useAuth();

  const confirmDelete = () => {
    handleDelete(id);
    onClose();
  };

  const handleClick = (e) => {
    e.preventDefault();

    // Check if the user has remaining attempts
    // if (remainingAttempts <= 0) {
    //   alert("You have reached the maximum number of interview attempts.");
    //   return;
    // }

    console.log("Interview Started");
    navigate("/new-interview", { state: { jobId: id } });
  };

  return (
    <>
      <div className="relative bg-none shadow-lg rounded-lg border-1 border-gray-100 p-4 my-5">
        
        <div className="container px-2">
          {/* <div className="grid gap-4 md:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr] items-start"> */}
          <div className="flex items-center justify-between">  
            <div className="flex items-start space-x-4">
              {/* Render company logo if provided */}
              <img
                alt="&nbsp;logo"
                className="rounded-lg object-cover aspect-square border"
                height="60" width="60"
                src={companyLogoUrl}
                onerror="this.onerror=null; this.src='path/to/fallback-icon.png';"
              />
              <div className="">
                {/* Render title if provided */}
                {title && (
                  <h3 className="text-lg text-indigo-500 font-bold tracking-tighter">
                    {title}
                  </h3>
                )}
                {/* Render company if provided */}
                {company && <p className="font-semibold text-gray-500 py-0 mt-0">{company}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              {/* Render Apply Now button */}
              <FormAction handleClick={() => window.open(jobLink, "_blank")} text="Apply Now" width="auto" padding = '10px 20px' />
              &nbsp; &nbsp; 
              {/* <StartInterviewModal handleClick={handleClick} /> */}
            </div>
          </div>
            <div className="space-y-1">
              {/* Render description if provided */}
              {description && (
                <div className="grid gap-0.5 items-start">
                  <h4 className="text-md text-indigo-500 font-semibold tracking-tighter mt-3">
                    Description
                  </h4>
                  <p className="text-gray-500 leading-7">{description}</p>
                </div>
              )}
              {/* Render location, employment type, and years of experience if provided */}
              <div className="flex items-center justify-start">
                {location && (
                  <div className="flex items-center mr-5 text-sm font-semibold text-indigo-500">
                    <Locate className="w-3.5 h-3.5 mr-1 " />
                    {location}
                  </div>
                )}
                {employmentType && (
                  <div className="flex items-center mr-5 text-sm font-semibold text-indigo-500">
                    <Luggage className="w-3.5 h-3.5 mr-1 " />
                    {employmentType}
                  </div>
                )}
                {yearsOfExperience !== undefined && (
                  <div className="flex items-center mr-5 text-sm font-semibold text-indigo-500">
                    <Crown className="w-3.5 h-3.5 mr-1 " />
                    {yearsOfExperience} years
                  </div>
                )}
              </div>
            </div>
        
            {skills?.length > 0 && (
              <div class="flex justify-start align-middle my-2">
                <h4 className="text-sm text-gray-500 font-semibold tracking-tight mr-3 mt-1">
                  Top skills
                </h4>
                {skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </div >
            )}

            {/* Render delete icon */}
          {userInfo?.role === "admin" && (
            <div className="flex justify-end">
              <Chip startContent= {<Pencil size={15} />} color="primary" variant="bordered"
                classNames={{
                  base: "border-1 border-indigo-500 px-3 cursor-pointer",
                  content: "font-medium text-indigo-500",
                }}
                onClick={() => handleEdit(id)}
              >
                Edit
              </Chip>
              &nbsp; &nbsp;
              <Chip startContent= {<Trash2 size={15} />} color="danger" variant="bordered"
              classNames={{
                base: "border-1  px-3 cursor-pointer",
                content: "font-medium ",
              }}
              onClick={onOpen}
              >
                Delete
              </Chip>

            </div>
          )}
            
        </div>
       
          
      </div>
      <DeleteConfirmationModel
        isOpen={isOpen}
        onClose={onClose}
        handleDelete={confirmDelete}
        subject={"job posting"}
      />
    </>
  );
}
