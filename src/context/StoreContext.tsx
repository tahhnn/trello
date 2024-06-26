import { useLocalStorage } from "@/hook/useLocalStorage";
import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext<{} | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedValue, setValue] = useLocalStorage("list", {});

  const [id, setId] = useState("");
  const [content, setContent] = useState(storedValue[id]?.content);
  console.log(storedValue[id]?.content);

  console.log(content);
  useEffect(() => {
    setContent(storedValue[id]?.content);
  }, [storedValue]);
  return (
    <StoreContext.Provider
      value={{ storedValue, setValue, content, setContent, setId }}
    >
      {children}
    </StoreContext.Provider>
  );
};
