import { useState, useContext } from "react";
import MapContext from "./mapContext";
import generalContext from "./generalContext";
import { v4 as uuidv4 } from "uuid";

const MapState = ({ children }) => {
	const [destination, setDestination] = useState(null);
	const [showMap, setShowMap] = useState(false);
	const [userLocation, setUserLocation] = useState(null);
	const [routeInfo, setRouteInfo] = useState(null);

	// Función para establecer un destino y mostrar la ruta
	const navigateToDestination = (destinationData) => {
		setDestination(destinationData);
		setShowMap(true);

		// Agregar el mensaje del mapa automáticamente al chat
		// Esto se hace dentro del contexto para que sea automático
		setTimeout(() => {
			// El mensaje se agregará desde el Chatbot component usando useEffect
		}, 100);
	};

	// Función para limpiar destino y rutas
	const clearDestination = () => {
		setDestination(null);
		setRouteInfo(null);
		setShowMap(false);
	};

	return (
		<MapContext.Provider
			value={{
				destination,
				setDestination,
				showMap,
				setShowMap,
				userLocation,
				setUserLocation,
				routeInfo,
				setRouteInfo,
				navigateToDestination,
				clearDestination,
			}}>
			{children}
		</MapContext.Provider>
	);
};

export default MapState;
