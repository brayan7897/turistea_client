import touristPlacesService from "./touristPlacesService";
import nearbyService from "./nearbyService";
import hotelsRestaurantsData from "../assets/json/hotels-restaurants.json";

class UnifiedExtractionService {
	constructor() {
		// Cargar datos de hoteles y restaurantes
		this.hotelsData = hotelsRestaurantsData.hoteles || {};
		this.restaurantsData = hotelsRestaurantsData.restaurantes || {};
		this.hotelKeywords = this.buildHotelKeywords();
		this.restaurantKeywords = this.buildRestaurantKeywords();
	}

	// Construir keywords para hoteles
	buildHotelKeywords() {
		const keywords = {};

		Object.values(this.hotelsData).forEach((hotel) => {
			// Agregar nombre del hotel
			const hotelName = hotel.nombre.toLowerCase();
			keywords[hotelName] = hotel;

			// Agregar palabras clave si existen
			if (hotel.keywords && Array.isArray(hotel.keywords)) {
				hotel.keywords.forEach((keyword) => {
					keywords[keyword.toLowerCase()] = hotel;
				});
			}
		});

		return keywords;
	}

	// Construir keywords para restaurantes
	buildRestaurantKeywords() {
		const keywords = {};

		Object.values(this.restaurantsData).forEach((restaurant) => {
			// Agregar nombre del restaurante
			const restaurantName = restaurant.nombre.toLowerCase();
			keywords[restaurantName] = restaurant;

			// Agregar palabras clave si existen
			if (restaurant.keywords && Array.isArray(restaurant.keywords)) {
				restaurant.keywords.forEach((keyword) => {
					keywords[keyword.toLowerCase()] = restaurant;
				});
			}
		});

		return keywords;
	}

	// Extraer hoteles mencionados en el texto
	extractHotelsFromText(text) {
		if (!text) return [];

		const hotels = [];
		const foundHotelNames = new Set();
		const normalizedText = text.toLowerCase();

		// Primero buscar identificadores específicos [HOTEL:Nombre]
		const hotelIdentifierRegex = /\[HOTEL:([^\]]+)\]/gi;
		let match;
		while ((match = hotelIdentifierRegex.exec(text)) !== null) {
			const hotelName = match[1].trim();
			const normalizedHotelName = hotelName.toLowerCase();

			// Buscar el hotel en los datos
			const hotelData = Object.values(this.hotelsData).find(
				(hotel) =>
					hotel.nombre.toLowerCase() === normalizedHotelName && hotel.activo
			);

			if (hotelData && !foundHotelNames.has(normalizedHotelName)) {
				foundHotelNames.add(normalizedHotelName);
				hotels.push(nearbyService.enrichHotelData(hotelData));
			}
		}

		// Si ya encontramos hoteles con identificadores, retornar solo esos
		if (hotels.length > 0) {
			return nearbyService.validateUniqueEstablishments(hotels);
		}

		// Buscar menciones específicas de hoteles por keywords solo si no hay identificadores
		for (const [keyword, hotelData] of Object.entries(this.hotelKeywords)) {
			if (normalizedText.includes(keyword)) {
				const hotelName = hotelData.nombre.toLowerCase();

				if (!foundHotelNames.has(hotelName) && hotelData.activo) {
					foundHotelNames.add(hotelName);
					hotels.push(nearbyService.enrichHotelData(hotelData));
				}
			}
		}

		// Buscar palabras clave generales de hoteles solo si no hay hoteles específicos
		if (hotels.length === 0) {
			const generalHotelKeywords = [
				"hotel",
				"hoteles",
				"hospedaje",
				"alojamiento",
				"donde quedarme",
				"dormir",
				"hostal",
				"pensión",
			];

			const hasGeneralHotelKeywords = generalHotelKeywords.some((keyword) =>
				normalizedText.includes(keyword)
			);

			if (hasGeneralHotelKeywords) {
				const featuredHotels = Object.values(this.hotelsData)
					.filter((hotel) => hotel.activo && hotel.destacado)
					.slice(0, 3)
					.map((hotel) => nearbyService.enrichHotelData(hotel));

				return nearbyService.validateUniqueEstablishments(featuredHotels);
			}
		}

		return nearbyService.validateUniqueEstablishments(hotels.slice(0, 4));
	}

	// Extraer restaurantes mencionados en el texto
	extractRestaurantsFromText(text) {
		if (!text) return [];

		const restaurants = [];
		const foundRestaurantNames = new Set();
		const normalizedText = text.toLowerCase();

		// Primero buscar identificadores específicos [RESTAURANTE:Nombre]
		const restaurantIdentifierRegex = /\[RESTAURANTE:([^\]]+)\]/gi;
		let match;
		while ((match = restaurantIdentifierRegex.exec(text)) !== null) {
			const restaurantName = match[1].trim();
			const normalizedRestaurantName = restaurantName.toLowerCase();

			// Buscar el restaurante en los datos
			const restaurantData = Object.values(this.restaurantsData).find(
				(restaurant) =>
					restaurant.nombre.toLowerCase() === normalizedRestaurantName &&
					restaurant.activo
			);

			if (
				restaurantData &&
				!foundRestaurantNames.has(normalizedRestaurantName)
			) {
				foundRestaurantNames.add(normalizedRestaurantName);
				restaurants.push(nearbyService.enrichRestaurantData(restaurantData));
			}
		}

		// Si ya encontramos restaurantes con identificadores, retornar solo esos
		if (restaurants.length > 0) {
			return nearbyService.validateUniqueEstablishments(restaurants);
		}

		// Buscar menciones específicas de restaurantes por keywords solo si no hay identificadores
		for (const [keyword, restaurantData] of Object.entries(
			this.restaurantKeywords
		)) {
			if (normalizedText.includes(keyword)) {
				const restaurantName = restaurantData.nombre.toLowerCase();

				if (
					!foundRestaurantNames.has(restaurantName) &&
					restaurantData.activo
				) {
					foundRestaurantNames.add(restaurantName);
					restaurants.push(nearbyService.enrichRestaurantData(restaurantData));
				}
			}
		}

		// Buscar palabras clave generales de restaurantes solo si no hay restaurantes específicos
		if (restaurants.length === 0) {
			const generalRestaurantKeywords = [
				"restaurante",
				"restaurantes",
				"comida",
				"comer",
				"donde comer",
				"almorzar",
				"cenar",
				"cocina",
				"gastronomía",
				"gastronomy",
				"platos típicos",
				"comida típica",
			];

			const hasGeneralRestaurantKeywords = generalRestaurantKeywords.some(
				(keyword) => normalizedText.includes(keyword)
			);

			if (hasGeneralRestaurantKeywords) {
				const featuredRestaurants = Object.values(this.restaurantsData)
					.filter((restaurant) => restaurant.activo && restaurant.destacado)
					.slice(0, 4)
					.map((restaurant) => nearbyService.enrichRestaurantData(restaurant));

				return nearbyService.validateUniqueEstablishments(featuredRestaurants);
			}
		}

		return nearbyService.validateUniqueEstablishments(restaurants.slice(0, 4));
	}

	// Extraer todos los tipos de lugares del texto
	extractAllFromText(text) {
		if (!text) return { touristPlaces: [], hotels: [], restaurants: [] };

		const touristPlaces = touristPlacesService.extractTouristPlaces(text);
		const hotels = this.extractHotelsFromText(text);
		const restaurants = this.extractRestaurantsFromText(text);

		return {
			touristPlaces,
			hotels,
			restaurants,
			hasAnyPlaces:
				touristPlaces.length > 0 || hotels.length > 0 || restaurants.length > 0,
		};
	}

	// Determinar si debe mostrar cards basado en el contenido
	shouldShowAnyCards(text) {
		if (!text) return false;

		const touristShouldShow = touristPlacesService.shouldShowCards(text);
		const hotelsShouldShow = this.shouldShowHotelCards(text);
		const restaurantsShouldShow = this.shouldShowRestaurantCards(text);

		return touristShouldShow || hotelsShouldShow || restaurantsShouldShow;
	}

	// Determinar si debe mostrar cards de hoteles
	shouldShowHotelCards(text) {
		if (!text) return false;

		const normalizedText = text.toLowerCase();

		// Palabras clave que activan cards de hoteles
		const hotelTriggerWords = [
			"hotel",
			"hoteles",
			"hospedaje",
			"alojamiento",
			"donde quedarme",
			"dormir",
			"hostal",
			"pensión",
		];

		// Verificar palabras clave generales
		const hasHotelTriggers = hotelTriggerWords.some((word) =>
			normalizedText.includes(word)
		);

		// Verificar si menciona algún hotel específico
		const mentionsSpecificHotel = Object.keys(this.hotelKeywords).some(
			(keyword) => normalizedText.includes(keyword)
		);

		return hasHotelTriggers || mentionsSpecificHotel;
	}

	// Determinar si debe mostrar cards de restaurantes
	shouldShowRestaurantCards(text) {
		if (!text) return false;

		const normalizedText = text.toLowerCase();

		// Palabras clave que activan cards de restaurantes
		const restaurantTriggerWords = [
			"restaurante",
			"restaurantes",
			"comida",
			"comer",
			"donde comer",
			"almorzar",
			"cenar",
			"cocina",
			"gastronomía",
			"gastronomy",
			"platos típicos",
			"comida típica",
		];

		// Verificar palabras clave generales
		const hasRestaurantTriggers = restaurantTriggerWords.some((word) =>
			normalizedText.includes(word)
		);

		// Verificar si menciona algún restaurante específico
		const mentionsSpecificRestaurant = Object.keys(
			this.restaurantKeywords
		).some((keyword) => normalizedText.includes(keyword));

		return hasRestaurantTriggers || mentionsSpecificRestaurant;
	}

	// Generar mensaje combinado para la respuesta del bot
	generateCombinedCardsMessage(extracted) {
		const { touristPlaces, hotels, restaurants } = extracted;
		const totalPlaces =
			touristPlaces.length + hotels.length + restaurants.length;

		if (totalPlaces === 0) {
			return null;
		}

		let message = "Información detallada";
		const parts = [];

		if (touristPlaces.length > 0) {
			parts.push(
				`${touristPlaces.length} lugar${
					touristPlaces.length > 1 ? "es" : ""
				} turístico${touristPlaces.length > 1 ? "s" : ""}`
			);
		}

		if (hotels.length > 0) {
			parts.push(`${hotels.length} hotel${hotels.length > 1 ? "es" : ""}`);
		}

		if (restaurants.length > 0) {
			parts.push(
				`${restaurants.length} restaurante${restaurants.length > 1 ? "s" : ""}`
			);
		}

		if (parts.length > 0) {
			message += ` de ${parts.join(", ")}`;
		}

		return message;
	}
}

export default new UnifiedExtractionService();
