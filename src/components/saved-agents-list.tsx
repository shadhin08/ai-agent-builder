import {
  Card,
  CardBody,
  Heading,
  HStack,
  Button,
  SimpleGrid,
  VStack,
  Box,
  Text,
  Badge,
  IconButton
} from "@chakra-ui/react";
import type { SavedAgent, AgentData } from "../types/index";
import { setAgentDragData } from "../common/core/dropzone";
import { FaRegPenToSquare } from "react-icons/fa6";

interface SavedAgentsListProps {
  agents: SavedAgent[];
  data: AgentData | null;
  onLoad: (agent: SavedAgent) => void;
  onDelete: (index: number) => void;
  onUpdate: (index: number) => void;
  onClearAll: () => void;
  loadingIndex: number | null;
}

export const SavedAgentsList = ({
  agents,
  data,
  onLoad,
  onDelete,
  onUpdate,
  onClearAll,
  loadingIndex
}: SavedAgentsListProps) => {
  if (agents.length === 0) return null;

  return (
    <Card bg="cyan.50" borderTop="4px" borderColor="cyan.500">
      <CardBody>
        <HStack justify="space-between" mb={6} wrap="wrap" gap={4}>
          <Heading size="md" color="cyan.700">
            Saved Agents ({agents.length})
          </Heading>
          <Button
            onClick={onClearAll}
            colorScheme="red"
            variant="outline"
            size="sm"
          >
            Clear All
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
          {agents.map((agent, index) => (
            <Card
              key={index}
              bg="white"
              borderTop="3px"
              borderColor="cyan.500"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.3s"
              draggable
              onDragStart={(e) => setAgentDragData(e, agent)}
              cursor="grab"
              _active={{ cursor: "grabbing" }}
            >
              <CardBody>
                <HStack justify="space-between" mb={3}>
                  <Heading size="sm" color="cyan.700">
                    {agent.name}
                  </Heading>
                  <IconButton
                    aria-label="Search database"
                    icon={<FaRegPenToSquare />}
                    size="xs"
                    variant="ghost"
                    colorScheme="cyan"
                    onClick={() => onUpdate(index)}
                  />
                </HStack>

                <VStack align="stretch" spacing={2} fontSize="sm" mb={4}>
                  <Box>
                    <Text fontWeight="600" color="gray.700">
                      Profile:
                    </Text>
                    <Text color="gray.600">
                      {data?.agentProfiles.find((p) => p.id === agent.profileId)
                        ?.name || "None"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="600" color="gray.700">
                      Skills: <Badge>{agent.skillIds?.length || 0}</Badge>
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="600" color="gray.700">
                      Layers: <Badge>{agent.layerIds?.length || 0}</Badge>
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="600" color="gray.700">
                      Provider:
                    </Text>
                    <Text color="gray.600">{agent.provider || "None"}</Text>
                  </Box>
                </VStack>

                <HStack gap={2}>
                  <Button
                    flex={1}
                    size="sm"
                    colorScheme="cyan"
                    onClick={() => onLoad(agent)}
                    isLoading={loadingIndex === index}
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => onDelete(index)}
                  >
                    Delete
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};
