// Servicio para manejar rutas y navegación en el mapa interactivo

class RouteService {
	constructor() {
		this.directionsService = null;
		this.directionsRenderer = null;
		this.mapInstance = null;
	}

	// Inicializar servicios de Google Maps
	initializeServices(mapInstance) {
		this.mapInstance = mapInstance;
		this.directionsService = new window.google.maps.DirectionsService();
		this.directionsRenderer = new window.google.maps.DirectionsRenderer({
			draggable: true,
			panel: null,
		});
		this.directionsRenderer.setMap(mapInstance);
	}

	// Calcular y mostrar ruta entre dos puntos
	async calculateRoute(origin, destination, travelMode = "DRIVING") {
		if (!this.directionsService || !this.directionsRenderer) {
			throw new Error("Servicios de direcciones no inicializados");
		}

		return new Promise((resolve, reject) => {
			this.directionsService.route(
				{
					origin: origin,
					destination: destination,
					travelMode: window.google.maps.TravelMode[travelMode],
					unitSystem: window.google.maps.UnitSystem.METRIC,
					avoidHighways: false,
					avoidTolls: false,
				},
				(result, status) => {
					if (status === "OK") {
						this.directionsRenderer.setDirections(result);
						resolve(result);
					} else {
						reject(new Error(`Error al calcular la ruta: ${status}`));
					}
				}
			);
		});
	}

	// Limpiar rutas del mapa
	clearRoute() {
		if (this.directionsRenderer) {
			this.directionsRenderer.setDirections({ routes: [] });
		}
	}

	// Obtener información de la ruta (distancia, tiempo)
	getRouteInfo(result) {
		if (!result || !result.routes || result.routes.length === 0) {
			return null;
		}

		const route = result.routes[0];
		const leg = route.legs[0];

		return {
			distance: leg.distance.text,
			duration: leg.duration.text,
			startAddress: leg.start_address,
			endAddress: leg.end_address,
			steps: leg.steps.map((step) => ({
				instruction: step.instructions.replace(/<[^>]*>/g, ""), // Limpiar HTML
				distance: step.distance.text,
				duration: step.duration.text,
			})),
		};
	}

	// Convertir coordenadas string a objeto LatLng
	parseCoordinates(coordString) {
		if (!coordString || typeof coordString !== "string") {
			return null;
		}

		const parts = coordString.split(",");
		if (parts.length !== 2) {
			return null;
		}

		const lat = parseFloat(parts[0].trim());
		const lng = parseFloat(parts[1].trim());

		if (isNaN(lat) || isNaN(lng)) {
			return null;
		}

		return { lat, lng };
	}

	// Añadir marcador en el destino
	addDestinationMarker(position, title, map) {
		return new window.google.maps.Marker({
			position: position,
			map: map,
			title: title,
			icon: {
				url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
				scaledSize: new window.google.maps.Size(40, 40),
			},
		});
	}

	// Centrar el mapa para mostrar toda la ruta
	fitRouteToView(result) {
		if (
			!this.mapInstance ||
			!result ||
			!result.routes ||
			result.routes.length === 0
		) {
			return;
		}

		const bounds = new window.google.maps.LatLngBounds();
		const route = result.routes[0];

		route.legs.forEach((leg) => {
			leg.steps.forEach((step) => {
				step.path.forEach((point) => {
					bounds.extend(point);
				});
			});
		});

		this.mapInstance.fitBounds(bounds);
	}
}

export default new RouteService();
