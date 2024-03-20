'use client'

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Pong = props => {
  const ref = useRef(null);

  useEffect(() => {
		const socket = io("http://localhost:3001/game");

    const canvas = ref.current;
    const context = canvas.getContext('2d');

		context.fillStyle = props.choice === "black" ? "black" : "white";
		context.fillRect(0, 0, canvas.width, canvas.height);

		return () => {
			socket.disconnect();
		}

  }, []);


  return <canvas ref={ref} {...props} />;
}

export default Pong;