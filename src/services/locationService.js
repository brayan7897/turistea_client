// Servicio para manejo de geolocalización y búsqueda por proximidad
class LocationService {
	constructor() {
		this.userLocation = null;
		this.watchId = null;
	}

	// Obtener ubicación actual del usuario
	async getCurrentLocation() {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error("Geolocalización no soportada por este navegador"));
				return;
			}

			const options = {
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000, // 5 minutos
			};

			navigator.geolocation.getCurrentPosition(
				(position) => {
					this.userLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
						accuracy: position.coords.accuracy,
					};
					resolve(this.userLocation);
				},
				(error) => {
					let errorMessage = "Error desconocido al obtener ubicación";

					switch (error.code) {
						case error.PERMISSION_DENIED:
							errorMessage = "Permiso de ubicación denegado por el usuario";
							break;
						case error.POSITION_UNAVAILABLE:
							errorMessage = "Información de ubicación no disponible";
							break;
						case error.TIMEOUT:
							errorMessage = "Tiempo de espera agotado al obtener ubicación";
							break;
					}

					reject(new Error(errorMessage));
				},
				options
			);
		});
	}

	// Calcular distancia entre dos puntos (fórmula de Haversine)
	calculateDistance(lat1, lng1, lat2, lng2) {
		const R = 6371; // Radio de la Tierra en km
		const dLat = this.toRadians(lat2 - lat1);
		const dLng = this.toRadians(lng2 - lng1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRadians(lat1)) *
				Math.cos(this.toRadians(lat2)) *
				Math.sin(dLng / 2) *
				Math.sin(dLng / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distancia en km
	}

	// Convertir grados a radianes
	toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	// Formatear distancia para mostrar
	formatDistance(distance) {
		if (distance < 1) {
			return `${Math.round(distance * 1000)}m`;
		} else if (distance < 10) {
			return `${distance.toFixed(1)}km`;
		} else {
			return `${Math.round(distance)}km`;
		}
	}

	// Filtrar lugares por proximidad
	filterByProximity(places, maxDistance = 50) {
		if (!this.userLocation) {
			return places; // Retornar todos si no hay ubicación
		}

		return places
			.map((place) => {
				// Parsear coordenadas del lugar
				const coords = place.coordenadas.split(",");
				const placeLat = parseFloat(coords[0].trim());
				const placeLng = parseFloat(coords[1].trim());

				// Calcular distancia
				const distance = this.calculateDistance(
					this.userLocation.lat,
					this.userLocation.lng,
					placeLat,
					placeLng
				);

				return {
					...place,
					distance: distance,
					distanceFormatted: this.formatDistance(distance),
				};
			})
			.filter((place) => place.distance <= maxDistance)
			.sort((a, b) => a.distance - b.distance);
	}

	// Obtener ubicación por defecto de Huánuco (centro de la ciudad)
	getDefaultHuanucoLocation() {
		return {
			lat: -9.9306,
			lng: -76.2422,
			accuracy: null,
		};
	}

	// Verificar si el usuario está en Huánuco (aproximadamente)
	isInHuanuco(userLat, userLng) {
		// Coordenadas aproximadas de la región de Huánuco
		const huanucoCenter = { lat: -9.9306, lng: -76.2422 };
		const distance = this.calculateDistance(
			userLat,
			userLng,
			huanucoCenter.lat,
			huanucoCenter.lng
		);

		// Considerar que está en Huánuco si está dentro de 200km del centro
		return distance <= 200;
	}

	// Solicitar permiso de ubicación de forma amigable
	async requestLocationPermission() {
		try {
			const location = await this.getCurrentLocation();
			return {
				success: true,
				location: location,
				message: "Ubicación obtenida correctamente",
			};
		} catch (error) {
			return {
				success: false,
				location: this.getDefaultHuanucoLocation(),
				message: error.message,
				usingDefault: true,
			};
		}
	}

	// Limpiar watch de ubicación
	stopWatchingLocation() {
		if (this.watchId !== null) {
			navigator.geolocation.clearWatch(this.watchId);
			this.watchId = null;
		}
	}
}

export default new LocationService();
