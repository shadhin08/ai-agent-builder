import {
  FormControl,
  FormLabel,
  VStack,
  Select as ChakraSelect
} from "@chakra-ui/react";
import type { MultiValue, ActionMeta } from "chakra-react-select";
import { Select } from "chakra-react-select";
import type { AgentData } from "../types/index";

interface SelectOption {
  label: string;
  value: string;
}

interface AgentBuilderProps {
  data: AgentData | null;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  onProfileChange: (value: string) => void;
  onSkillsChange: (
    options: MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
  onLayersChange: (
    options: MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
  onProviderChange: (value: string) => void;
}

export const AgentBuilder = ({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  onProfileChange,
  onSkillsChange,
  onLayersChange,
  onProviderChange
}: AgentBuilderProps) => {
  if (!data) return null;

  const skillOptions = data.skills.map((s) => ({
    label: `${s.name} (${s.category})`,
    value: s.id
  }));

  const layerOptions = data.layers.map((l) => ({
    label: `${l.name} (${l.type})`,
    value: l.id
  }));

  const selectedSkillsOptions = selectedSkills
    .map((id) => skillOptions.find((opt) => opt.value === id))
    .filter(Boolean) as SelectOption[];

  const selectedLayersOptions = selectedLayers
    .map((id) => layerOptions.find((opt) => opt.value === id))
    .filter(Boolean) as SelectOption[];

  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel fontWeight="bold">Base Profile</FormLabel>
        <ChakraSelect
          value={selectedProfile}
          onChange={(e) => onProfileChange(e.target.value)}
          placeholder="-- Select a Profile --"
          size="md"
          borderColor="blue.200"
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
        >
          {data.agentProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </ChakraSelect>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="bold">Add Skills (Multi-select)</FormLabel>
        <Select
          isMulti
          options={skillOptions}
          value={selectedSkillsOptions}
          onChange={onSkillsChange}
          placeholder="-- Select Skills to Add --"
          colorScheme="blue"
          size="md"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="bold">
          Add Personality Layers (Multi-select)
        </FormLabel>
        <Select
          isMulti
          options={layerOptions}
          value={selectedLayersOptions}
          onChange={onLayersChange}
          placeholder="-- Select Layers to Add --"
          colorScheme="blue"
          size="md"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="bold">AI Provider</FormLabel>
        <ChakraSelect
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          placeholder="-- Select a Provider --"
          size="md"
          borderColor="blue.200"
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
        >
          {["Gemini", "ChatGPT", "Kimi", "Claude", "DeepSeek"].map(
            (provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            )
          )}
        </ChakraSelect>
      </FormControl>
    </VStack>
  );
};
