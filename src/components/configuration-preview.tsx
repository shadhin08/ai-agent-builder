import {
  Box,
  VStack,
  Text,
  Divider,
  Badge,
  Button,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import type { AgentData } from "../types/index";

interface ConfigurationPreviewProps {
  data: AgentData | null;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  onSave: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  isDragActive: boolean;
  isUpdate?: boolean;
}

export const ConfigurationPreview = ({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  onSave,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragActive,
  isUpdate = false
}: ConfigurationPreviewProps) => {
  if (!data) return null;

  return (
    <VStack
      spacing={6}
      align="stretch"
      h="100%"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      bg={isDragActive ? "blue.50" : "transparent"}
      borderRadius="md"
      transition="background-color 0.2s"
      p={isDragActive ? 4 : 0}
    >
      <Box>
        <Text fontWeight="bold" mb={2}>
          Profile
        </Text>
        {selectedProfile ? (
          <Box
            bg="blue.50"
            p={3}
            borderRadius="md"
            borderLeft="4px"
            borderColor="blue.500"
          >
            <Text fontWeight="600" color="blue.700">
              {data.agentProfiles.find((p) => p.id === selectedProfile)?.name}
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {
                data.agentProfiles.find((p) => p.id === selectedProfile)
                  ?.description
              }
            </Text>
          </Box>
        ) : (
          <Text color="gray.500" fontStyle="italic">
            No profile selected
          </Text>
        )}
      </Box>

      <Divider />

      <Box>
        <Text fontWeight="bold" mb={2}>
          Selected Skills ({selectedSkills.length})
        </Text>
        {selectedSkills.length > 0 ? (
          <Wrap gap={2}>
            {selectedSkills.map((skillId) => {
              const skill = data.skills.find((s) => s.id === skillId);
              return (
                <WrapItem key={skillId}>
                  <Badge
                    colorScheme="blue"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {skill?.name}
                  </Badge>
                </WrapItem>
              );
            })}
          </Wrap>
        ) : (
          <Text color="gray.500" fontStyle="italic">
            No skills added
          </Text>
        )}
      </Box>

      <Divider />

      <Box>
        <Text fontWeight="bold" mb={2}>
          Selected Layers ({selectedLayers.length})
        </Text>
        {selectedLayers.length > 0 ? (
          <Wrap gap={2}>
            {selectedLayers.map((layerId) => {
              const layer = data.layers.find((l) => l.id === layerId);
              return (
                <WrapItem key={layerId}>
                  <Badge
                    colorScheme="purple"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {layer?.name}
                  </Badge>
                </WrapItem>
              );
            })}
          </Wrap>
        ) : (
          <Text color="gray.500" fontStyle="italic">
            No layers added
          </Text>
        )}
      </Box>

      <Divider />

      <Box>
        <Text fontWeight="bold" mb={2}>
          AI Provider
        </Text>
        {selectedProvider ? (
          <Badge colorScheme="green" px={3} py={1} fontSize="sm">
            {selectedProvider}
          </Badge>
        ) : (
          <Text color="gray.500" fontStyle="italic">
            No provider selected
          </Text>
        )}
      </Box>

      <Divider />

      <Box>
        <Text fontWeight="bold" mb={3}>
          {isUpdate ? "Update Configuration" : "Save Configuration"}
        </Text>
        <Button
          onClick={onSave}
          colorScheme={isUpdate ? "blue" : "green"}
          size="md"
          w="100%"
        >
          {isUpdate ? "Update" : "Save"}
        </Button>
      </Box>
    </VStack>
  );
};
