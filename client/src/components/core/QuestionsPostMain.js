import { Trash2, Pencil } from "lucide-react";
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

export default function QuestionPostMain({
  id,
  category,
  subCategory,
  question,
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
        <div className="container px-4 md:px-6 flex items-start py-3">
          <div className="flex-1">
            <div className="space-y-2.5">
              <h3 className="text-xl text-black font-semibold tracking-tighter">
                {question}
              </h3>
              <p className="text-gray-500">{`${category}`}</p>
            </div>
          </div>
        </div>
        <div className="container px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <div className="space-y-4 flex-1">
              {skills?.length > 0 && (
                <>
                  <h4 className="text-lg text-black font-semibold tracking-tight">
                    Skills
                  </h4>
                  {skills.map((skill, index) => (
                    <SkillTag key={index} skill={skill} />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModel
        isOpen={isOpen}
        onClose={onClose}
        handleDelete={confirmDelete}
        subject={"interview question"}
      />
    </>
  );
}
