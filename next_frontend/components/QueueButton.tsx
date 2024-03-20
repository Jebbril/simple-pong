'use client'

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const QueueButton = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleClick =async () => {
		try {
			setLoading(true);
			const response = await axios.get('join or create game endpoint');

			const gameUuid = response.data.gameUuid;
			router.push(gameUuid);
		} catch (error) {
			console.error('Error: ', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button onClick={handleClick} disabled={loading}>
				{loading ? 'Waiting...' : 'Join the Queue'}
			</button>
		</div>
	);
};

export default QueueButton;