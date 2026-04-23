//Map
import type { QuizId } from "@/data/questions";
import type { FlipbookId } from "@/data/flipbooks";
import { Rect } from "@/game/util/Rect";
import type { Interactable } from "@/game/objects/Interact";
import type { MapId } from "@/game/save/SaveLoad";

export type WallFrame = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  imageSrc: string;
};

export type MapDef = {
  id: MapId;
  title: string;
  width: number;
  height: number;
  obstacles: Rect[];
  interactables: Interactable[];
  wallFrames: WallFrame[];
};

function exhibit(
  id: string,
  x: number,
  y: number,
  title: string,
  flipbookId: FlipbookId,
  titleColor?: string,
): Interactable {
  return {
    id,
    type: "exhibit",
    rect: new Rect(x, y, 140, 100),
    title,
    hint: "Nhấn E để xem flipbook",
    flipbookId,
    titleColor,
  };
}

function doorOrStage(
  id: string,
  type: "door" | "stage",
  x: number,
  y: number,
  title: string,
  quizId: QuizId,
): Interactable {
  return {
    id,
    type,
    rect: new Rect(x, y, 180, 70),
    title,
    hint: "Nhấn E để làm quiz",
    quizId,
  };
}

export function buildMaps(): Record<MapId, MapDef> {
  const W = 2400;
  const H = 720;

  // Keep consistent with the renderer wall bands in Game.ts
  const WALL_TOP_H = 50;
  const WALL_BOTTOM_H = -20;

  const map1Obstacles: Rect[] = [];
  const map3Obstacles: Rect[] = [];

  const addObstacle = (arr: Rect[], r: Rect) => arr.push(r);

  const addWallObstacles = (arr: Rect[]) => {
    addObstacle(arr, new Rect(0, 0, W, WALL_TOP_H));
    addObstacle(arr, new Rect(0, H - WALL_BOTTOM_H, W, WALL_BOTTOM_H));
  };

  addWallObstacles(map1Obstacles);
  addWallObstacles(map3Obstacles);

  // Pedestals as obstacles (slightly larger than interact rect)
  const pedestalObstacle = (x: number, y: number) =>
    new Rect(x - 10, y - 10, 156, 126);

  // Map 1 exhibits
  const m1Exhibits: Interactable[] = [
    exhibit(
      "m1-e3",
      580,
      718,
      "Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam",
      "m1-phap-luat",
      "#ff0000",
    ),
    exhibit(
      "m1-e4",
      1700,
      718,
      "Quá trình nhẫn thức của Đảng",
      "m1-to-chuc",
      "#ff0000",
    ),
  ];
  for (const it of m1Exhibits)
    addObstacle(map1Obstacles, pedestalObstacle(it.rect.x, it.rect.y));

  // Door frame draws at x-6..x+w+6; keep fully inside the map.
  const m1Door = doorOrStage(
    "m1-door",
    "door",
    W * 0.5 - 90,
    40,
    "Cửa qua màn 2",
    "map1",
  );
  addObstacle(
    map1Obstacles,
    new Rect(m1Door.rect.x, m1Door.rect.y, m1Door.rect.w, m1Door.rect.h),
  );

  // Map 3 exhibits (avoid top wall frames)
  const m3Exhibits: Interactable[] = [
    exhibit("m3-e1", 600, 688, "Tính tất yếu khách quan", "m3-tong-ket1", "#ff0000"),
    exhibit("m3-e2", 1650, 720, "Làm bài tập luyện", "m3-kho-de"),
  ];
  for (const it of m3Exhibits)
    addObstacle(map3Obstacles, pedestalObstacle(it.rect.x, it.rect.y));

  const m3Stage = doorOrStage(
    "m3-stage",
    "stage",
    W - 300,
    H / 2,
    "Hoàn thành trò chơi",
    "final",
  );
  addObstacle(
    map3Obstacles,
    new Rect(m3Stage.rect.x, m3Stage.rect.y, m3Stage.rect.w, m3Stage.rect.h),
  );

  return {
    1: {
      id: 1,
      title:
        "Màn 1: Kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam ",
      width: W,
      height: H,
      obstacles: map1Obstacles,
      interactables: [...m1Exhibits, m1Door],
      wallFrames: [],
    },
    3: {
      id: 3,
      title: "Màn 2: Phòng tổng kết",
      width: W,
      height: H,
      obstacles: map3Obstacles,
      interactables: [...m3Exhibits, m3Stage],
      wallFrames: [],
    },
  };
}
