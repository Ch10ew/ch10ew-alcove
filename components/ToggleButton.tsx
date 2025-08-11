"use client";

import { cn } from "@/lib/util";
import React from "react";

interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function ToggleButton({ label, isActive, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-md transition-colors duration-300",
        isActive ? "bg-primary text-foreground" : "bg-card hover:bg-card-hover"
      )}
    >
      {label}
    </button>
  );
}
