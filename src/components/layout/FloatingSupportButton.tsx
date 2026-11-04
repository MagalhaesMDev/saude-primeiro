"use client";

import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingSupportButton() {
  return (
    <Button
      className="fixed bottom-24 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg"
      variant="success"
      size="icon"
    >
      <Headphones className="w-5 h-5" />
    </Button>
  );
}