import { useApi } from "./useApi";
import { useState, useEffect } from "react";

export const useCouncilList = () => {
  const { api } = useApi();
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    setList(Object.keys(api.query).filter((key: string): boolean => key.endsWith('Council')));
  }, []);

  return list;
};
