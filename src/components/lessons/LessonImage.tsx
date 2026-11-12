import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { Lesson } from "@/data/lessons";

interface LessonImageProps {
  lesson: Pick<Lesson, "imageSrc" | "imageAlt">;
  className?: string;
}

export function LessonImage({ lesson, className }: LessonImageProps) {
  const [source, setSource] = useState(lesson.imageSrc);
  const [placeholderFailed, setPlaceholderFailed] = useState(false);

  if (placeholderFailed) {
    return (
      <div
        role="img"
        aria-label={lesson.imageAlt}
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className ?? ""}`}
      >
        <ImageOff aria-hidden="true" className="h-8 w-8" />
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={lesson.imageAlt}
      className={className}
      onError={() => {
        if (source === "/placeholder.svg") {
          setPlaceholderFailed(true);
          return;
        }
        setSource("/placeholder.svg");
      }}
    />
  );
}
