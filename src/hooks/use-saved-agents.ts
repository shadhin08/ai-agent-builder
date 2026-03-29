import { useState, useEffect } from "react";
import type { SavedAgent } from "../types/index";

const STORAGE_KEY = "savedAgents";

export const useSavedAgents = () => {
  const [agents, setAgents] = useState<SavedAgent[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAgents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved agents", e);
      }
    }
  }, []);

  const saveAgent = (agent: SavedAgent) => {
    const updated = [...agents, agent];
    setAgents(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteAgent = (index: number) => {
    const updated = agents.filter((_, i) => i !== index);
    setAgents(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateAgent = (index: number, agent: SavedAgent) => {
    const updated = agents.map((a, i) => (i === index ? agent : a));
    setAgents(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setAgents([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { agents, saveAgent, deleteAgent, updateAgent, clearAll };
};
