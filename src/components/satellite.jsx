import React from 'react';
import { propagate, twoline2satrec } from 'satellite.js';
// TODO: Make into real satellite objects

const Satellite = ({ satellite, sunColor, focusOnSatellite }) => {
	const formatPostion = (position) => {
		if (position < 0 && position < -150) {
			position = `${position}`;
			position = position.slice(0, 3);
			position = parseInt(position)
		} else if (position > 0 && position > 150) {
			position = `${position}`;
			position = position.slice(0, 2);
			position = parseInt(position)
		}

		return position;
	}

	const displaySatInfo = (satInfo) => {
		let { satelliteId, name } = satInfo;
		const satInfoModal = document.getElementsByClassName('satellite-modal')[0];
		satInfoModal.style.display = 'flex'
		document.body.style.cursor = 'pointer';

		const satId = document.getElementById("sat-id");
		const satName = document.getElementById("sat-name");
		if (!satId || !satName) return;
		if (satId.innerText !== satelliteId) pulseGreen()

		satId.innerText = ''
		satName.innerText = ''
		let id = document.createTextNode(`Sat Id: ${satelliteId}`);
		name = document.createTextNode(`Name: ${name}`);
		satId.appendChild(id);
		satName.appendChild(name);
	}

	const closeSatInfo = () => {
		const satInfoModal = document.getElementsByClassName('satellite-modal')[0];
		satInfoModal.style.display = 'none'
		document.body.style.cursor = 'auto';

		const satId = document.getElementById("sat-id");
		const satName = document.getElementById("sat-name");
		if (!satId || !satName) return;

		satId.innerText = 'Sat Id: ';
		satName.innerText = 'Name: ';
	}

	const toggleMount = () => {
		const satInfoModal = document.getElementsByClassName('satellite-modal')[0];

		if (Array.from(satInfoModal.classList).includes('mounted')) {
			satInfoModal.classList.remove('mounted');
			return;
		}

		satInfoModal.classList.add('mounted');
		pulseGreen()
	}

	const isMounted = () => {
		const satInfoModal = document.getElementsByClassName('satellite-modal')[0];
		if (Array.from(satInfoModal.classList).includes('mounted')) return true;
		return false;
	}

	const pulseGreen = () => {
		const satInfoModal = document.getElementsByClassName('satellite-modal')[0];
		satInfoModal.style.backgroundColor = '#451728'
		setTimeout(() => satInfoModal.style.backgroundColor = ' #31344e', 400)
	}

	const handleSatClick = () => {
		if (isMounted()) {
			focusOnSatellite([0, 0, 0])
		} else {
			focusOnSatellite([satelliteX, satelliteY, satelliteZ])
		}
		toggleMount();
	}

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
		<mesh
			onPointerOver={() => displaySatInfo(satelliteInfo)}
			onPointerOut={() =>
				isMounted() ? (document.body.style.cursor = 'auto') : closeSatInfo()
			}
			onClick={() => handleSatClick()}
			visible
			position={[satelliteX, satelliteY, satelliteZ]}
			rotation={[Math.PI / 2, 0, 0]}>
			<sphereGeometry args={[0.5, 12, 12]} />
			<meshStandardMaterial color='white' emissive={sunColor} emissiveIntensity={ 0.4 } metalness={ 0.9 } roughness={ 0.9 } />
		</mesh>
	);
};

export default Satellite;
