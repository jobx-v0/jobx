import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function DeleteConfirmationModel({
  isOpen,
  onOpen,
  onClose,
  handleDelete,
  subject
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpen={onOpen}
        size="xl"
        className=""
        hideCloseButton
      >
        <ModalContent className="flex justify-center items-center">
          <div className="w-[30rem]">
            <ModalHeader className="pb-0 text-center">
              <p className="text-slate-600">
                Are you sure you want to delete the {`${subject}`}?
              </p>
            </ModalHeader>
            <ModalFooter className="flex">
              <Button
                color="primary"
                size="sm"
                variant="bordered"
                onClick={onClose}
                className="text-sm px-5 text-blue-600 rounded-md font-medium mt-2 border-1"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={handleDelete}
                className="text-sm rounded-md font-medium mt-2 bg-red-600"
              >
                Delete
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
