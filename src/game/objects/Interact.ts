//Object
import type { QuizId } from "@/data/questions";
import { Rect } from "@/game/util/Rect";

export type InteractType = "exhibit" | "door" | "stage" | "frame";

export type Interactable = {
  id: string;
  type: InteractType;
  rect: Rect;
  title: string;
  hint: string;
  flipbookId?: string;
  quizId?: QuizId;
  imageSrc?: string;
};
