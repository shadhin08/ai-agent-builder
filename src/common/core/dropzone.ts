import type { SavedAgent } from "../../types/index";

const AGENT_DRAG_TYPE = "application/json-agent";

export const serializeAgent = (agent: SavedAgent): string => {
  return JSON.stringify(agent);
};

export const deserializeAgent = (data: string): SavedAgent | null => {
  try {
    return JSON.parse(data) as SavedAgent;
  } catch {
    return null;
  }
};

export const setAgentDragData = (
  event: React.DragEvent<HTMLElement>,
  agent: SavedAgent
): void => {
  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setData(AGENT_DRAG_TYPE, serializeAgent(agent));
};

export const getAgentFromDrop = (
  event: React.DragEvent<HTMLElement>
): SavedAgent | null => {
  const data = event.dataTransfer.getData(AGENT_DRAG_TYPE);
  return data ? deserializeAgent(data) : null;
};

export const handleDragOver = (event: React.DragEvent<HTMLElement>): void => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
};

export const handleDragLeave = (event: React.DragEvent<HTMLElement>): void => {
  event.preventDefault();
};
