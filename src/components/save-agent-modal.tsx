import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast
} from "@chakra-ui/react";

interface SaveAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  isUpdate?: boolean;
  initialName?: string;
}

export const SaveAgentModal = ({
  isOpen,
  onClose,
  onConfirm,
  isUpdate = false,
  initialName = ""
}: SaveAgentModalProps) => {
  const [agentName, setAgentName] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setAgentName(isUpdate ? initialName : "");
    }
  }, [isOpen, isUpdate, initialName]);

  const handleConfirm = () => {
    if (!agentName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for your agent.",
        status: "warning",
        duration: 2000,
        isClosable: true
      });
      return;
    }

    onConfirm(agentName);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isUpdate ? "Update Agent" : "Save Agent Configuration"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>{isUpdate ? "Agent Name" : "Agent Name"}</FormLabel>
            <Input
              placeholder={isUpdate ? "Update agent name" : "Enter agent name"}
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              size="md"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme={isUpdate ? "blue" : "green"}
            onClick={handleConfirm}
          >
            {isUpdate ? "Update" : "Confirm"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
