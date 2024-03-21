'use client'

import { useRouter } from "next/navigation";
import gameSocket from "./socket";
import { useState } from "react";

const JoinButton = (props) => {
	const router = useRouter();
	const [joinText, setJoinText] = useState("Join Queue");

	let playerNo = 0;
	let roomId = "";

	const joinGame = () => {
		gameSocket.emit("join");

		setJoinText("Waiting for another player to join ...");

		gameSocket.on("playerNo", (data) => {
			playerNo = data;
		});

		gameSocket.on("startingGame", (data) => {
			roomId = data;
			router.push(`/game/${roomId}?choice=${props.choice}`);
		});

	}

	return (
		<div {...props} onClick={joinGame}>
			{joinText}
		</div>
	);
}

export default JoinButton;