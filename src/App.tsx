import { useState, useEffect } from "react";
import type { SavedAgent } from "./types/index";
import type { MultiValue, ActionMeta } from "chakra-react-select";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spinner,
  Flex,
  useDisclosure,
  useToast,
  Stack
} from "@chakra-ui/react";
import { AgentBuilder } from "./components/agent-builder";
import { ConfigurationPreview } from "./components/configuration-preview";
import { SavedAgentsList } from "./components/saved-agents-list";
import { ResetModal } from "./components/reset-modal";
import { SaveAgentModal } from "./components/save-agent-modal";
import { useAgentData } from "./hooks/use-agent-data";
import { useSavedAgents } from "./hooks/use-saved-agents";
import {
  getAgentFromDrop,
  handleDragOver as dragOverUtility,
  handleDragLeave as dragLeaveUtility
} from "./common/core/dropzone";

interface SelectOption {
  label: string;
  value: string;
}

function App() {
  const { data, loading, error, fetch } = useAgentData();
  const { agents, saveAgent, deleteAgent, updateAgent, clearAll } =
    useSavedAgents();
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose
  } = useDisclosure();
  const {
    isOpen: isSaveOpen,
    onOpen: onSaveOpen,
    onClose: onSaveClose
  } = useDisclosure();
  const toast = useToast();

  const [sessionTime, setSessionTime] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [loadingAgentIndex, setLoadingAgentIndex] = useState<number | null>(
    null
  );
  const [isDragActive, setIsDragActive] = useState(false);
  const [editingAgentIndex, setEditingAgentIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  const handleSkillSelect = (
    options: MultiValue<SelectOption>,
    _actionMeta: ActionMeta<SelectOption>
  ) => {
    setSelectedSkills(
      Array.isArray(options) ? options.map((opt) => opt.value) : []
    );
  };

  const handleLayerSelect = (
    options: MultiValue<SelectOption>,
    _actionMeta: ActionMeta<SelectOption>
  ) => {
    setSelectedLayers(
      Array.isArray(options) ? options.map((opt) => opt.value) : []
    );
  };

  const handleResetProfile = () => {
    setSelectedProfile("");
    setSelectedSkills([]);
    setSelectedLayers([]);
    setSelectedProvider("");
    onResetClose();
    toast({
      title: "Profile Reset",
      description: "Your agent profile has been reset to the starting point.",
      status: "info",
      duration: 3000,
      isClosable: true
    });
  };

  const handleSaveAgent = (agentName: string) => {
    const newAgent: SavedAgent = {
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider
    };

    if (editingAgentIndex !== null) {
      updateAgent(editingAgentIndex, newAgent);
      toast({
        title: "Success",
        description: `Agent "${newAgent.name}" updated successfully!`,
        status: "success",
        duration: 3000,
        isClosable: true
      });
      setEditingAgentIndex(null);
    } else {
      saveAgent(newAgent);
      toast({
        title: "Success",
        description: `Agent "${newAgent.name}" saved successfully!`,
        status: "success",
        duration: 3000,
        isClosable: true
      });
    }

    setSelectedProfile("");
    setSelectedSkills([]);
    setSelectedLayers([]);
    setSelectedProvider("");
  };

  const handleUpdateAgent = (index: number) => {
    const agent = agents[index];
    setSelectedProfile(agent.profileId || "");
    setSelectedSkills(agent.skillIds || []);
    setSelectedLayers(agent.layerIds || []);
    setSelectedProvider(agent.provider || "");
    setEditingAgentIndex(index);
  };

  const handleLoadAgent = (agent: SavedAgent) => {
    const index = agents.indexOf(agent);
    setLoadingAgentIndex(index);
    setTimeout(() => {
      setSelectedProfile(agent.profileId || "");
      setSelectedSkills(agent.skillIds || []);
      setSelectedLayers(agent.layerIds || []);
      setSelectedProvider(agent.provider || "");
      setLoadingAgentIndex(null);
      toast({
        title: "Loaded",
        description: `Agent "${agent.name}" loaded successfully!`,
        status: "success",
        duration: 2000,
        isClosable: true
      });
    }, 300);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    dragOverUtility(event);
    setIsDragActive(true);
  };

  const handleDragLeaveLocal = (event: React.DragEvent<HTMLDivElement>) => {
    dragLeaveUtility(event);
    setIsDragActive(false);
  };

  const handleDropAgent = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const agent = getAgentFromDrop(event);
    if (agent) {
      handleLoadAgent(agent);
    }
  };

  const handleDeleteAgent = (index: number) => {
    deleteAgent(index);
    toast({
      title: "Deleted",
      description: "Agent has been removed.",
      status: "info",
      duration: 2000,
      isClosable: true
    });
  };

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "Cleared",
      description: "All saved agents have been removed.",
      status: "info",
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <Box mb={8}>
          <Stack spacing={3} align="center">
            <Heading as="h1" size="2xl" mb={2} color="blue.700">
              AI Agent Builder
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={6}>
              Design your custom AI personality and capability set
            </Text>
          </Stack>

          <HStack justify="space-between" mb={6} wrap="wrap" gap={4}>
            <Text fontSize="sm" color="gray.600" fontWeight="500">
              Session: <Badge colorScheme="green">{sessionTime}s</Badge>
            </Text>
            <HStack gap={3}>
              <Button
                onClick={fetch}
                isLoading={loading}
                loadingText="Fetching..."
                colorScheme="blue"
                size="md"
              >
                Reload Configuration
              </Button>
              <Button
                onClick={onResetOpen}
                colorScheme="orange"
                variant="outline"
                size="md"
              >
                Reset Profile
              </Button>
            </HStack>
          </HStack>

          {error && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => {}}
              />
            </Alert>
          )}
        </Box>

        {loading && (
          <Flex justify="center" align="center" minH="400px" gap={4}>
            <Spinner size="lg" color="blue.500" />
            <Text fontSize="lg" color="gray.600">
              Loading agent configuration...
            </Text>
          </Flex>
        )}

        {!loading && data && (
          <>
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={6}
              mb={8}
              h="800px"
            >
              <GridItem>
                <Card h="100%">
                  <CardBody>
                    <Heading size="md" mb={6} color="blue.600">
                      Configuration Options
                    </Heading>
                    <AgentBuilder
                      data={data}
                      selectedProfile={selectedProfile}
                      selectedSkills={selectedSkills}
                      selectedLayers={selectedLayers}
                      selectedProvider={selectedProvider}
                      onProfileChange={setSelectedProfile}
                      onSkillsChange={handleSkillSelect}
                      onLayersChange={handleLayerSelect}
                      onProviderChange={setSelectedProvider}
                    />
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card h="100%">
                  <CardBody>
                    <Heading size="md" mb={6} color="blue.600">
                      Current Configuration
                    </Heading>
                    <ConfigurationPreview
                      data={data}
                      selectedProfile={selectedProfile}
                      selectedSkills={selectedSkills}
                      selectedLayers={selectedLayers}
                      selectedProvider={selectedProvider}
                      onSave={onSaveOpen}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeaveLocal}
                      onDrop={handleDropAgent}
                      isDragActive={isDragActive}
                      isUpdate={editingAgentIndex !== null}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            <SavedAgentsList
              agents={agents}
              data={data}
              onLoad={handleLoadAgent}
              onDelete={handleDeleteAgent}
              onUpdate={handleUpdateAgent}
              onClearAll={handleClearAll}
              loadingIndex={loadingAgentIndex}
            />
          </>
        )}

        {!loading && !data && !error && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>No Data</AlertTitle>
              <AlertDescription>
                Click "Reload Configuration" to fetch agent configuration data.
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </Container>

      <ResetModal
        isOpen={isResetOpen}
        onClose={onResetClose}
        onConfirm={handleResetProfile}
      />

      <SaveAgentModal
        isOpen={isSaveOpen}
        onClose={() => {
          onSaveClose();
          setEditingAgentIndex(null);
        }}
        onConfirm={handleSaveAgent}
        isUpdate={editingAgentIndex !== null}
        initialName={
          editingAgentIndex !== null ? agents[editingAgentIndex]?.name : ""
        }
      />
    </Box>
  );
}

export default App;
