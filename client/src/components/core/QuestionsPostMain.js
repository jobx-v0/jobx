import { Trash2, Pencil, Folders } from "lucide-react";
import { useDisclosure } from "@nextui-org/react";
import { useAuth } from "../../context/AuthContext";
import DeleteConfirmationModel from "./DeleteConfirmationModal";
import {Chip} from "@nextui-org/chip";

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
      <div className="relative bg-none shadow-md rounded-lg border-1 border-gray-100 p-4 my-5">
        <div className="flex justify-between">
          <div>
            <Chip startContent= {<Folders size={15} />} color="default" variant="bordered"
                classNames={{
                  base: "border-1 border-gray-300 rounded-small px-2",
                  content: "font-medium text-xs text-gray-600",
                }}

              >
                {category}
            </Chip>
          </div>
          <div>
            {userInfo?.role === "admin" && (
            <div className="flex justify-end">
              <Chip startContent= {<Pencil size={15} />} color="primary" variant="bordered"
                classNames={{
                  base: "border-1 border-indigo-500 rounded-small px-2 cursor-pointer",
                  content: "font-medium text-xs text-indigo-500",
                }}
                onClick={() => handleEdit(id)}
              >
                Edit
              </Chip>
              &nbsp; &nbsp;
              <Chip startContent= {<Trash2 size={15} />} color="danger" variant="bordered"
              classNames={{
                base: "border-1 rounded-small px-2 cursor-pointer",
                content: "font-medium text-xs",
              }}
              onClick={onOpen}
              >
                Delete
              </Chip>

            </div>
          )}
          </div>

        </div>
        <div className="container flex items-start pt-2">
          <p className="text-sm text-gray-500">{question}</p>
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
