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
): Interactable {
  return {
    id,
    type: "exhibit",
    rect: new Rect(x, y, 140, 100),
    title,
    hint: "Nhấn E để xem flipbook",
    flipbookId,
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

function frameInteractable(id: string, f: WallFrame): Interactable {
  return {
    id,
    type: "frame",
    rect: new Rect(f.x, f.y, f.w, f.h),
    title: f.title,
    hint: "Nhấn E để phóng to khung hình",
    imageSrc: f.imageSrc,
  };
}

export function buildMaps(): Record<MapId, MapDef> {
  const W = 2400;
  const H = 720;

  const FRAME_M3_F1_IMAGE = "/assets/image1.jpg";
  const FRAME_M3_F2_IMAGE = "/assets/image2.jpg";
  const STAGE_TROPHY_IMAGE = "/assets/trophy.png";

  // Keep consistent with the renderer wall bands in Game.ts
  const WALL_TOP_H = 50;
  const WALL_BOTTOM_H = -20;

  const map1Obstacles: Rect[] = [];
  const map2Obstacles: Rect[] = [];
  const map3Obstacles: Rect[] = [];

  const addObstacle = (arr: Rect[], r: Rect) => arr.push(r);

  const addWallObstacles = (arr: Rect[]) => {
    addObstacle(arr, new Rect(0, 0, W, WALL_TOP_H));
    addObstacle(arr, new Rect(0, H - WALL_BOTTOM_H, W, WALL_BOTTOM_H));
  };

  addWallObstacles(map1Obstacles);
  addWallObstacles(map2Obstacles);
  addWallObstacles(map3Obstacles);

  // Pedestals as obstacles (slightly larger than interact rect)
  const pedestalObstacle = (x: number, y: number) => new Rect(x - 10, y - 10, 156, 126);

  // Map 1 exhibits
  const m1Exhibits: Interactable[] = [
    exhibit("m1-e3", 580, 750, "Nguồn gốc Nhà nước xã hội chủ nghĩa", "m1-phap-luat"),
    exhibit("m1-e4", 1700, 750, "Mối quan hệ dân chủ xã hội chủ nghĩa và nhà nước xã hội chủ nghĩa", "m1-to-chuc"),
  ];
  for (const it of m1Exhibits) addObstacle(map1Obstacles, pedestalObstacle(it.rect.x, it.rect.y));

  // Door frame draws at x-6..x+w+6; keep fully inside the map.
  const m1Door = doorOrStage("m1-door", "door", W * 0.5 - 90, 40, "Cửa qua màn 2", "map1");
  addObstacle(map1Obstacles, new Rect(m1Door.rect.x, m1Door.rect.y, m1Door.rect.w, m1Door.rect.h));

  // Map 2 exhibits
  const m2Exhibits: Interactable[] = [
    exhibit("m2-e1", 470, 450, "Dân chủ XHCN ở Việt Nam", "m2-dan-chu"),
    exhibit("m2-e2", 1180, 450, "Nhà nước pháp quyền XHCN ở Việt Nam", "m2-phap-quyen"),
    exhibit("m2-e3", 1920, 450, "Phát huy Nhà nước pháp quyền XHCN", "m2-phat-huy"),
  ];
  for (const it of m2Exhibits) addObstacle(map2Obstacles, pedestalObstacle(it.rect.x, it.rect.y));

  const m2Door = doorOrStage("m2-door", "door", W * 0.5 - 80, 30, "Cửa qua màn 3", "map2");
  addObstacle(map2Obstacles, new Rect(m2Door.rect.x, m2Door.rect.y, m2Door.rect.w, m2Door.rect.h));

  // Map 3 exhibits (avoid top wall frames)
  const m3Exhibits: Interactable[] = [
    exhibit("m3-e1", 600, 720, "Ôn tập nhanh", "m3-tong-ket1"),
    exhibit("m3-e2", 1650, 720, "Ôn tập nhanh", "m3-tong-ket2"),
  ];
  for (const it of m3Exhibits) addObstacle(map3Obstacles, pedestalObstacle(it.rect.x, it.rect.y));

  const m3Stage = doorOrStage(
    "m3-stage",
    "stage",
    W - 300,
    H / 2,
    "Sân khấu tổng kết",
    "final",
  );
  addObstacle(map3Obstacles, new Rect(m3Stage.rect.x, m3Stage.rect.y, m3Stage.rect.w, m3Stage.rect.h));

  const wallFrames: WallFrame[] = [
    {
      id: "m3-f1",
      x: 720,
      y: 90,
      w: 420,
      h: 190,
      title: "",
      imageSrc: FRAME_M3_F1_IMAGE,
    },
    {
      id: "m3-f2",
      x: 1320,
      y: 90,
      w: 420,
      h: 190,
      title: "",
      imageSrc: FRAME_M3_F2_IMAGE,
    },
  ];

  // Frames behave like objects: collision + interact popup
  const m3Frames = wallFrames.map((f) => frameInteractable(f.id, f));
  for (const f of wallFrames) {
    addObstacle(map3Obstacles, new Rect(f.x - 8, f.y - 8, f.w + 16, f.h + 16));
  }

  return {
    1: {
      id: 1,
      title: "Màn 1: Nhà nước xã hội chủ nghĩa",
      width: W,
      height: H,
      obstacles: map1Obstacles,
      interactables: [...m1Exhibits, m1Door],
      wallFrames: [],
    },
    2: {
      id: 2,
      title: "Màn 2: Dân chủ XHCN và nhà nước pháp quyền XHCN ở Việt Nam",
      width: W,
      height: H,
      obstacles: map2Obstacles,
      interactables: [...m2Exhibits, m2Door],
      wallFrames: [],
    },
    3: {
      id: 3,
      title: "Màn 3: Phòng tổng kết",
      width: W,
      height: H,
      obstacles: map3Obstacles,
      interactables: [...m3Exhibits, ...m3Frames, m3Stage],
      wallFrames,
    },
  };
}
