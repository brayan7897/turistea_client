// Configuración de ubicaciones por defecto para Huánuco
class LocationConfig {
	constructor() {
		// Centro de Huánuco - Plaza de Armas
		this.defaultLocation = {
			lat: -9.9306,
			lng: -76.2422,
			name: "Plaza de Armas de Huánuco",
			description: "Centro histórico de la ciudad de Huánuco",
		};

		// Ubicaciones alternativas importantes
		this.importantLocations = {
			plazaDeArmas: {
				lat: -9.9306,
				lng: -76.2422,
				name: "Plaza de Armas",
				description: "Centro histórico de Huánuco",
			},
			kotosh: {
				lat: -9.92884205423662,
				lng: -76.28053106393838,
				name: "Kotosh",
				description: "Templo de las Manos Cruzadas",
			},
			tingoMaria: {
				lat: -9.276,
				lng: -75.988,
				name: "Tingo María",
				description: "Puerta de entrada a la Amazonía",
			},
			puenteCalicanto: {
				lat: -9.932,
				lng: -76.238,
				name: "Puente Calicanto",
				description: "Puente colonial histórico",
			},
		};
	}

	// Obtener ubicación por defecto
	getDefaultLocation() {
		return { ...this.defaultLocation };
	}

	// Obtener ubicación específica
	getLocation(locationKey) {
		return this.importantLocations[locationKey]
			? { ...this.importantLocations[locationKey] }
			: this.getDefaultLocation();
	}

	// Validar si una ubicación está dentro del área de Huánuco
	isValidHuanucoLocation(lat, lng) {
		// Límites aproximados de la región de Huánuco
		const bounds = {
			north: -8.5,
			south: -11.0,
			east: -74.5,
			west: -77.5,
		};

		return (
			lat >= bounds.south &&
			lat <= bounds.north &&
			lng >= bounds.west &&
			lng <= bounds.east
		);
	}

	// Obtener ubicación válida o retornar la por defecto
	getValidLocationOrDefault(lat, lng) {
		if (lat && lng && this.isValidHuanucoLocation(lat, lng)) {
			return { lat, lng };
		}
		return this.getDefaultLocation();
	}

	// Formatear coordenadas para OpenAI
	formatLocationForOpenAI(location) {
		if (!location || !location.lat || !location.lng) {
			location = this.getDefaultLocation();
		}

		return {
			lat: location.lat,
			lng: location.lng,
			formatted: `${location.lat}, ${location.lng}`,
			description: location.name || "Ubicación en Huánuco",
		};
	}

	// Calcular distancia entre dos puntos (en kilómetros)
	calculateDistance(lat1, lng1, lat2, lng2) {
		const R = 6371; // Radio de la Tierra en kilómetros
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLng = ((lng2 - lng1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLng / 2) *
				Math.sin(dLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	// Encontrar la ubicación más cercana a un punto dado
	findNearestImportantLocation(lat, lng) {
		let nearest = null;
		let minDistance = Infinity;

		Object.values(this.importantLocations).forEach((location) => {
			const distance = this.calculateDistance(
				lat,
				lng,
				location.lat,
				location.lng
			);
			if (distance < minDistance) {
				minDistance = distance;
				nearest = { ...location, distance };
			}
		});

		return nearest;
	}

	// Generar contexto de ubicación para el chatbot
	generateLocationContext(userLocation) {
		const location = userLocation || this.getDefaultLocation();
		const nearest = this.findNearestImportantLocation(
			location.lat,
			location.lng
		);

		return {
			current: this.formatLocationForOpenAI(location),
			nearest: nearest,
			context: `Usuario ubicado cerca de ${
				nearest ? nearest.name : "el centro de Huánuco"
			}`,
		};
	}
}

export default new LocationConfig();
