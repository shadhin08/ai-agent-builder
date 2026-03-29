import { useState, useCallback } from "react";
import type { AgentData } from "../types/index";
import { fetchAgentData } from "../services/api";

export const useAgentData = () => {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAgentData();
      setData(result);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch agent data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
};
