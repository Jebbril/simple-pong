"use client";

import { useSearchParams } from "next/navigation";
import Pong from "./Pong";

export default function Game() {
  const searchParams = useSearchParams();

  const choice = searchParams.get("choice");
  // console.log("choice", choice);
  return (
		<main className=" h-screen bg-gradient-to-t from-[var(--blue-color)] to-[var(--mint-color)] flex flex-col">
      <div className="flex  items-center justify-center h-full">
        <div className="flex flex-col gap-4">
        	<div className="flex justify-between">
            {/* <p className="text-lg text-[var(third-color)] mb-4">asdasdasda</p>
            <p className="text-lg text-[var(third-color)] mb-4">asdasdasda</p>
            <p className="text-lg text-[var(third-color)] mb-4">asdasdasda</p> */}
          </div>
          <Pong width={1200} height={700} choice={choice} />
        </div>
      </div>
    </main>
  );
}
