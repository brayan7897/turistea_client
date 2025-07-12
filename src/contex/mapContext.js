import { createContext } from "react";

const MapContext = createContext({
	destination: null,
	setDestination: () => {},
	showMap: false,
	setShowMap: () => {},
	userLocation: null,
	setUserLocation: () => {},
	routeInfo: null,
	setRouteInfo: () => {},
	navigateToDestination: () => {},
	clearDestination: () => {},
});

export default MapContext;
