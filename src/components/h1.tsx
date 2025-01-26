import React from "react";

export default function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-medium text-2xl leading-6">
      Pet<span className="font-semibold">Soft</span>
    </h1>
  );
}
