import type { AgentData } from "../types/index";

export const fetchAgentData = async (): Promise<AgentData> => {
  const delay = Math.floor(Math.random() * 2000) + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const response = await fetch("/data.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
