import { Button } from "@nextui-org/react";
import { Locate, Luggage, Crown, Trash2, Pencil } from "lucide-react";
import { useDisclosure } from "@nextui-org/react";
import { useAuth } from "../../context/AuthContext";
import DeleteConfirmationModel from "./DeleteConfirmationModal";

const SkillTag = ({ skill }) => {
  return (
    <div className="inline-block rounded-full bg-gray-200 px-4 py-2 mr-2 hover:bg-gray-300 cursor-pointer">
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo } = useAuth();

  const confirmDelete = () => {
    handleDelete(id);
    onClose();
  };

  return (
    <>
      <div className="relative bg-gray-100 shadow-md rounded-3xl p-6 my-5">
        {/* Render delete icon */}
        {userInfo?.role === "admin" && (
          <>
            <div className="absolute top-2 right-2">
              <Trash2
                className="text-red-500 cursor-pointer"
                onClick={onOpen}
              />
            </div>
            <div className="absolute top-2 right-10">
              <Pencil
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEdit(id)}
              />
            </div>
          </>
        )}
        <div className="container px-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr] items-start">
            <div className="flex items-start space-x-4">
              {/* Render company logo if provided */}
              <img
                alt="Company logo"
                className="rounded-lg object-cover aspect-square border"
                height="80"
                src={companyLogoUrl}
                width="80"
              />
              <div className="space-y-2.5">
                {/* Render title if provided */}
                {title && (
                  <h3 className="text-2xl text-black font-bold tracking-tighter">
                    {title}
                  </h3>
                )}
                {/* Render company if provided */}
                {company && <p className="text-gray-500">{company}</p>}
              </div>
            </div>
            <div className="space-y-4">
              {/* Render description if provided */}
              {description && (
                <div className="grid gap-0.5 items-start">
                  <h4 className="text-xl text-black font-semibold tracking-tighter">
                    Description
                  </h4>
                  <p className="text-gray-500 leading-7">{description}</p>
                </div>
              )}
              {/* Render location, employment type, and years of experience if provided */}
              <div className="flex items-center justify-evenly">
                {location && (
                  <div className="flex items-center">
                    <Locate className="w-4 h-4 mr-1 text-black" />
                    <span className="text-gray-500">{location}</span>
                  </div>
                )}
                {employmentType && (
                  <div className="flex items-center">
                    <Luggage className="w-4 h-4 mr-1 text-black" />
                    <span className="text-gray-500">{employmentType}</span>
                  </div>
                )}
                {yearsOfExperience !== undefined && (
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 mr-1 text-black" />
                    <span className="text-gray-500">
                      {yearsOfExperience} Years Exp
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container px-4 md:px-6">
          <div className="container px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <div className="space-y-4 flex-1">
                {skills?.length > 0 && (
                  <>
                    <h4 className="text-lg text-black font-semibold tracking-tight">
                      Top Skills
                    </h4>
                    {skills.map((skill, index) => (
                      <SkillTag key={index} skill={skill} />
                    ))}
                  </>
                )}
              </div>
              {/* Render Apply Now button */}
              <Button
                className="ml-auto mt-10 text-white bg-indigo-800"
                size="lg"
                radius="full"
                variant="bordered"
                onClick={() => window.open(jobLink, "_blank")}
              >
                Apply Now
              </Button>
              {/* Render Start Interview button */}
              <Button
                className="ml-auto mt-10 text-white bg-indigo-800"
                size="lg"
                radius="full"
                variant="bordered"
              >
                Start Interview
              </Button>
            </div>
          </div>
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
