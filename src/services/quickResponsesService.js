import firebaseData from "../assets/json/firebase-db.json";
import touristPlacesService from "./touristPlacesService";
import nearbyService from "./nearbyService";

class QuickResponsesService {
	constructor() {
		this.placesData = firebaseData.lugares || {};
	}

	// Obtener lugares más visitados (por calificación)
	getMostVisitedPlaces() {
		const places = Object.values(this.placesData)
			.filter((place) => place.activo && place.calificacion)
			.sort((a, b) => b.calificacion - a.calificacion)
			.slice(0, 3);

		return places;
	}

	// Obtener lugares recomendados para principiantes
	getRecommendedPlaces() {
		// Lugares más accesibles y populares
		const recommendedIds = ["201", "200", "202"]; // Plaza de Armas, Kotosh, Catedral
		const places = recommendedIds
			.map((id) => this.placesData[id])
			.filter((place) => place && place.activo);

		return places;
	}

	// Obtener lugares para aventura/naturaleza
	getAdventurePlaces() {
		const adventureKeywords = [
			"cueva",
			"laguna",
			"tingo maria",
			"bella durmiente",
		];
		const places = Object.values(this.placesData)
			.filter((place) => {
				return (
					place.activo &&
					place.keywords &&
					place.keywords.some((keyword) =>
						adventureKeywords.some((advKeyword) =>
							keyword.toLowerCase().includes(advKeyword)
						)
					)
				);
			})
			.slice(0, 3);

		return places;
	}

	// Obtener lugares históricos/culturales
	getHistoricalPlaces() {
		const historicalKeywords = [
			"arqueologico",
			"colonial",
			"templo",
			"catedral",
			"plaza",
			"puente",
		];
		const places = Object.values(this.placesData)
			.filter((place) => {
				return (
					place.activo &&
					place.keywords &&
					place.keywords.some((keyword) =>
						historicalKeywords.some((histKeyword) =>
							keyword.toLowerCase().includes(histKeyword)
						)
					)
				);
			})
			.slice(0, 3);

		return places;
	}

	// Obtener lugares cercanos al centro de Huánuco
	getNearbyPlaces() {
		// Lugares en la ciudad de Huánuco (no Tingo María ni lugares lejanos)
		const nearbyIds = ["201", "202", "203", "200"]; // Plaza, Catedral, Puente, Kotosh
		const places = nearbyIds
			.map((id) => this.placesData[id])
			.filter((place) => place && place.activo)
			.slice(0, 3);

		return places;
	}

	// Obtener pre-respuestas con información de lugares
	getQuickResponses() {
		return [
			{
				id: "most-visited",
				title: "🏆 Lugares más visitados",
				subtitle: "Los destinos favoritos de los turistas",
				places: this.getMostVisitedPlaces(),
				message:
					"¡Hola! Te muestro los lugares más visitados de Huánuco basados en las calificaciones de otros viajeros:",
			},
			{
				id: "recommended",
				title: "⭐ Lugares recomendados",
				subtitle: "Perfectos para comenzar tu visita",
				places: this.getRecommendedPlaces(),
				message:
					"Te recomiendo estos lugares ideales para conocer lo esencial de Huánuco:",
			},
			{
				id: "adventure",
				title: "🏔️ Aventura y naturaleza",
				subtitle: "Para los amantes de la naturaleza",
				places: this.getAdventurePlaces(),
				message:
					"Si buscas aventura y contacto con la naturaleza, estos lugares son perfectos:",
			},
			{
				id: "historical",
				title: "🏛️ Lugares históricos",
				subtitle: "Conoce la rica historia de Huánuco",
				places: this.getHistoricalPlaces(),
				message:
					"Descubre la fascinante historia de Huánuco visitando estos lugares emblemáticos:",
			},
			{
				id: "nearby",
				title: "📍 Lugares cercanos",
				subtitle: "Fáciles de visitar en el centro",
				places: this.getNearbyPlaces(),
				message:
					"Si prefieres quedarte cerca del centro de la ciudad, estos lugares son ideales:",
			},
			{
				id: "nearby-hotels",
				title: "🏨 Hoteles cercanos",
				subtitle: "Encuentra alojamiento cerca de ti",
				isAsync: true,
				asyncMethod: this.getNearbyHotels.bind(this),
				message: "Buscando hoteles cercanos a tu ubicación...",
			},
			{
				id: "nearby-restaurants",
				title: "🍽️ Restaurantes cercanos",
				subtitle: "Comida deliciosa cerca de ti",
				isAsync: true,
				asyncMethod: this.getNearbyRestaurants.bind(this),
				message: "Buscando restaurantes cercanos a tu ubicación...",
			},
			{
				id: "nearby-all",
				title: "🏪 Hoteles y restaurantes",
				subtitle: "Todo lo que necesitas cerca de ti",
				isAsync: true,
				asyncMethod: this.getNearbyEstablishments.bind(this),
				message: "Buscando hoteles y restaurantes cercanos...",
			},
		];
	}

	// Obtener una pre-respuesta específica por ID
	getQuickResponseById(responseId) {
		const responses = this.getQuickResponses();
		return responses.find((response) => response.id === responseId);
	}

	// Obtener pre-respuesta aleatoria para mostrar por defecto
	getRandomQuickResponse() {
		const responses = this.getQuickResponses();
		const randomIndex = Math.floor(Math.random() * responses.length);
		return responses[randomIndex];
	}

	// Convertir lugares a formato compatible con DynamicListCards
	convertPlacesToCardFormat(places) {
		return places.map((place) => ({
			title: place.nombre,
			description: place.descripcion,
			location: place.direccion,
			activities: place.actividades || "Información no disponible",
			tips: place.consejos || "Información no disponible",
			imageUrl: place.imagen || "",
			calificacion: place.calificacion || 0,
			coordenadas: place.coordenadas || "",
			originalData: place,
		}));
	}

	// Obtener hoteles cercanos
	async getNearbyHotels() {
		try {
			const hotels = await nearbyService.getNearbyHotels();
			return hotels;
		} catch (error) {
			console.error("Error obteniendo hoteles cercanos:", error);
			return [];
		}
	}

	// Obtener restaurantes cercanos
	async getNearbyRestaurants() {
		try {
			const restaurants = await nearbyService.getNearbyRestaurants();
			return restaurants;
		} catch (error) {
			console.error("Error obteniendo restaurantes cercanos:", error);
			return [];
		}
	}

	// Obtener establecimientos cercanos (hoteles y restaurantes)
	async getNearbyEstablishments() {
		try {
			const establishments = await nearbyService.getNearbyEstablishments();
			return establishments;
		} catch (error) {
			console.error("Error obteniendo establecimientos cercanos:", error);
			return { hotels: [], restaurants: [] };
		}
	}
}

export default new QuickResponsesService();
