import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Card,
  CardBody,
  SimpleGrid,
  Heading,
  Text
} from "@chakra-ui/react";
import type { SavedAgent, AgentData } from "../types/index";

interface LoadAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: SavedAgent[];
  data: AgentData | null;
  onLoad: (agent: SavedAgent) => void;
}

export const LoadAgentModal = ({
  isOpen,
  onClose,
  agents,
  data,
  onLoad
}: LoadAgentModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Load Saved Agent</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {agents.map((agent, index) => (
              <Card
                key={index}
                cursor="pointer"
                _hover={{ boxShadow: "lg", bg: "blue.50" }}
                transition="all 0.2s"
                onClick={() => {
                  onLoad(agent);
                  onClose();
                }}
                borderColor="blue.200"
                borderWidth={2}
              >
                <CardBody>
                  <Heading size="sm" mb={2}>
                    {agent.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {
                      data?.agentProfiles.find((p) => p.id === agent.profileId)
                        ?.name
                    }
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
