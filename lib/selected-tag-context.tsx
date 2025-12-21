"use client";

import { createContext, useContext, ReactNode, Suspense } from "react";
import { useSelectedTag } from "./url-state";

interface SelectedTagContextType {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const SelectedTagContext = createContext<SelectedTagContextType | undefined>(undefined);

function SelectedTagProviderInner({ children }: { children: ReactNode }) {
  const [selectedTag, setSelectedTag] = useSelectedTag();

  return (
    <SelectedTagContext.Provider value={{ selectedTag, setSelectedTag }}>
      {children}
    </SelectedTagContext.Provider>
  );
}

export function SelectedTagProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectedTagProviderInner>{children}</SelectedTagProviderInner>
    </Suspense>
  );
}

export function useSelectedTagContext() {
  const context = useContext(SelectedTagContext);
  if (context === undefined) {
    throw new Error("useSelectedTagContext must be used within a SelectedTagProvider");
  }
  return context;
}