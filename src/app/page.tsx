"use client";

import dynamic from "next/dynamic";

const GamePage = dynamic(() => import("@/components/GamePage").then((m) => m.GamePage), {
  ssr: false,
  loading: () => <div style={{ position: "fixed", inset: 0, background: "#d9dee7" }} />,
});

export default function Home() {
  return <GamePage />;
}
