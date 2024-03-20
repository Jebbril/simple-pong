'use client'

import { useEffect, useRef } from "react";

const Pong = props => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');

		context.fillStyle = props.choice === "black" ? "black" : "white";
		context.fillRect(0, 0, canvas.width, canvas.height);

  }, []);


  return <canvas ref={ref} {...props} />;
}

export default Pong;