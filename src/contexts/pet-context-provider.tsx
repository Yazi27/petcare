"use client";

import { TPetData } from "@/lib/types";
import React, { createContext, useState } from "react";

type TPetContext = {
  pets: TPetData[];
  selectedPetId: string | null;
  handleChangeSelectPetId: (id: string) => void;
  selectedPet: TPetData | undefined;
};

type PetContextProviderProps = {
  children: React.ReactNode;
  data: TPetData[];
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  const handleChangeSelectPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleChangeSelectPetId,
        selectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
