import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function SubmitIntervieModal({
  isSubmitModalOpen,
  onOpenSubmitModal,
  onCloseSubmitModal,
  handleSubmit,
}) {
  return (
    <>
      <Modal
        isOpen={isSubmitModalOpen}
        onOpen={onOpenSubmitModal}
        size="xl"
        className=""
        hideCloseButton
      >
        <ModalContent>
          <>
            <ModalHeader className="pb-0">
              <p className="text-slate-600">Submit Interview</p>
            </ModalHeader>
            <ModalBody>
              <p className="text-md text-slate-500 p-0">
                Are you sure you want to submit the interview?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                size="sm"
                variant="bordered"
                onClick={onCloseSubmitModal}
                className="text-sm px-5 text-blue-600 rounded-md font-medium mt-2 border-1"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={() => {
                  handleSubmit();
                  onCloseSubmitModal();
                }}
                className="text-sm rounded-md font-medium mt-2 bg-blue-600"
              >
                Submit Interview
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
