import React from 'react';
import { EciVec3, propagate, twoline2satrec } from 'satellite.js';
import {
	formatPostion,
	displaySatInfo,
	closeSatInfo,
	isMounted,
	toggleMount,
} from '../util/satellite_helpers';

const Satellite = ({ satellite }) => {
	// Initialize a satellite record
	let satrec = twoline2satrec(satellite.line1, satellite.line2);
	const positionAndVelocity = propagate(satrec, new Date());

	// get position
	let positionEci = positionAndVelocity.position;

	const randomNumber = () => {
		return Math.floor(Math.random() * (150 - 21 + 1)) + 21;
	};

	// console.log(positionAndVelocity);
	// console.log(positionEci);

	let satelliteX;
	let satelliteY;
	let satelliteZ;

	// x, y, z, coordinates
	if (positionEci && positionEci.x && positionEci.y && positionEci.z) {
		satelliteX = positionEci.x || randomNumber();
		satelliteY = positionEci.y || randomNumber();
		satelliteZ = positionEci.z || randomNumber();
	}

	// reduce coordinates to fit canvas
	satelliteX = formatPostion(satelliteX);
	satelliteY = formatPostion(satelliteY);
	satelliteZ = formatPostion(satelliteZ);

	const satelliteInfo = {
		satelliteId: satellite.satelliteId,
		name: satellite.name,
	};

	return (
		<>
			<mesh
				onPointerOver={() => displaySatInfo(satelliteInfo)}
				onPointerOut={() =>
					isMounted() ? (document.body.style.cursor = 'auto') : closeSatInfo()
				}
				onClick={() => toggleMount()}
				visible
				position={[satelliteX, satelliteY, satelliteZ]}
				rotation={[Math.PI / 2, 0, 0]}>
				<sphereGeometry args={[0.5, 12, 12]} />
				<meshStandardMaterial color='white' />
			</mesh>
		</>
	);
};

export default Satellite;
