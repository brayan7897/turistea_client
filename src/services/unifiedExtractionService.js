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

		console.log("🏨 [DEBUG] Buscando hoteles en texto:", text);

		// Primero buscar identificadores específicos [HOTEL:Nombre]
		const hotelIdentifierRegex = /\[HOTEL:([^\]]+)\]/gi;
		let match;
		while ((match = hotelIdentifierRegex.exec(text)) !== null) {
			const hotelName = match[1].trim();
			const normalizedHotelName = hotelName.toLowerCase();

			console.log(
				"🔍 [DEBUG] Identificador encontrado:",
				hotelName,
				"→",
				normalizedHotelName
			);

			// Buscar el hotel en los datos (búsqueda más flexible)
			const hotelData = Object.values(this.hotelsData).find((hotel) => {
				const dbHotelName = hotel.nombre.toLowerCase();
				const isExactMatch = dbHotelName === normalizedHotelName;
				const isPartialMatch =
					dbHotelName.includes(normalizedHotelName) ||
					normalizedHotelName.includes(dbHotelName);

				console.log(
					"🏨 [DEBUG] Comparando:",
					dbHotelName,
					"con",
					normalizedHotelName,
					"| Exacto:",
					isExactMatch,
					"| Parcial:",
					isPartialMatch
				);

				return (isExactMatch || isPartialMatch) && hotel.activo;
			});

			if (hotelData && !foundHotelNames.has(hotelData.nombre.toLowerCase())) {
				console.log("✅ [DEBUG] Hotel encontrado:", hotelData.nombre);
				foundHotelNames.add(hotelData.nombre.toLowerCase());
				hotels.push(nearbyService.enrichHotelData(hotelData));
			} else {
				console.log("❌ [DEBUG] Hotel NO encontrado para:", hotelName);
			}
		}

		// Si ya encontramos hoteles con identificadores, retornar solo esos
		if (hotels.length > 0) {
			console.log(
				"🎯 [DEBUG] Retornando hoteles por identificador:",
				hotels.length
			);
			return nearbyService.validateUniqueEstablishments(hotels);
		}

		// Si no hay identificadores pero el usuario pregunta por hoteles, mostrar destacados
		const hotelQuestionKeywords = [
			"donde puedo hospedarme",
			"donde quedarme",
			"donde dormir",
			"hoteles",
			"hotel",
			"hospedaje",
			"alojamiento",
		];

		const isAskingForHotels = hotelQuestionKeywords.some((keyword) =>
			normalizedText.includes(keyword)
		);

		if (isAskingForHotels) {
			console.log(
				"🏨 [DEBUG] Usuario pregunta por hoteles, mostrando destacados"
			);
			const featuredHotels = Object.values(this.hotelsData)
				.filter((hotel) => hotel.activo && hotel.destacado)
				.slice(0, 3)
				.map((hotel) => nearbyService.enrichHotelData(hotel));

			return nearbyService.validateUniqueEstablishments(featuredHotels);
		}

		// NO buscar por keywords ni palabras generales si no pregunta específicamente
		console.log(
			"❌ [DEBUG] No se encontraron identificadores de hoteles ni preguntas específicas"
		);
		return [];
	}

	// Extraer restaurantes mencionados en el texto
	extractRestaurantsFromText(text) {
		if (!text) return [];

		const restaurants = [];
		const foundRestaurantNames = new Set();
		const normalizedText = text.toLowerCase();

		console.log("🍽️ [DEBUG] Buscando restaurantes en texto:", text);

		// Primero buscar identificadores específicos [RESTAURANTE:Nombre]
		const restaurantIdentifierRegex = /\[RESTAURANTE:([^\]]+)\]/gi;
		let match;
		while ((match = restaurantIdentifierRegex.exec(text)) !== null) {
			const restaurantName = match[1].trim();
			const normalizedRestaurantName = restaurantName.toLowerCase();

			console.log(
				"🔍 [DEBUG] Identificador encontrado:",
				restaurantName,
				"→",
				normalizedRestaurantName
			);

			// Buscar el restaurante en los datos (búsqueda más flexible)
			const restaurantData = Object.values(this.restaurantsData).find(
				(restaurant) => {
					const dbRestaurantName = restaurant.nombre.toLowerCase();
					const isExactMatch = dbRestaurantName === normalizedRestaurantName;
					const isPartialMatch =
						dbRestaurantName.includes(normalizedRestaurantName) ||
						normalizedRestaurantName.includes(dbRestaurantName);

					console.log(
						"🍽️ [DEBUG] Comparando:",
						dbRestaurantName,
						"con",
						normalizedRestaurantName,
						"| Exacto:",
						isExactMatch,
						"| Parcial:",
						isPartialMatch
					);

					return (isExactMatch || isPartialMatch) && restaurant.activo;
				}
			);

			if (
				restaurantData &&
				!foundRestaurantNames.has(restaurantData.nombre.toLowerCase())
			) {
				console.log(
					"✅ [DEBUG] Restaurante encontrado:",
					restaurantData.nombre
				);
				foundRestaurantNames.add(restaurantData.nombre.toLowerCase());
				restaurants.push(nearbyService.enrichRestaurantData(restaurantData));
			} else {
				console.log(
					"❌ [DEBUG] Restaurante NO encontrado para:",
					restaurantName
				);
			}
		}

		// Si ya encontramos restaurantes con identificadores, retornar solo esos
		if (restaurants.length > 0) {
			console.log(
				"🎯 [DEBUG] Retornando restaurantes por identificador:",
				restaurants.length
			);
			return nearbyService.validateUniqueEstablishments(restaurants);
		}

		// Si no hay identificadores pero el usuario pregunta por restaurantes, mostrar destacados
		const restaurantQuestionKeywords = [
			"donde puedo comer",
			"donde comer",
			"donde almorzar",
			"donde cenar",
			"restaurantes",
			"restaurante",
			"comida",
			"comer",
			"gastronomía",
		];

		const isAskingForRestaurants = restaurantQuestionKeywords.some((keyword) =>
			normalizedText.includes(keyword)
		);

		if (isAskingForRestaurants) {
			console.log(
				"🍽️ [DEBUG] Usuario pregunta por restaurantes, mostrando destacados"
			);
			const featuredRestaurants = Object.values(this.restaurantsData)
				.filter((restaurant) => restaurant.activo && restaurant.destacado)
				.slice(0, 4)
				.map((restaurant) => nearbyService.enrichRestaurantData(restaurant));

			return nearbyService.validateUniqueEstablishments(featuredRestaurants);
		}

		// NO buscar por keywords ni palabras generales si no pregunta específicamente
		console.log(
			"❌ [DEBUG] No se encontraron identificadores de restaurantes ni preguntas específicas"
		);
		return [];
	}

	// Extraer todos los tipos de lugares del texto con filtro de prioridad
	extractAllFromText(text) {
		if (!text) return { touristPlaces: [], hotels: [], restaurants: [] };

		console.log("🔍 [DEBUG] Iniciando extracción con filtro de tipo único");

		const touristPlaces = touristPlacesService.extractTouristPlaces(text);
		const hotels = this.extractHotelsFromText(text);
		const restaurants = this.extractRestaurantsFromText(text);

		console.log("📊 [DEBUG] Resultados iniciales:", {
			touristPlaces: touristPlaces.length,
			hotels: hotels.length,
			restaurants: restaurants.length,
		});

		// FILTRO: Solo mostrar UN tipo de establecimiento a la vez
		// Prioridad: 1. Identificadores específicos, 2. Hoteles, 3. Restaurantes, 4. Lugares turísticos

		// Prioridad 1: Si hay identificadores específicos en el texto, mostrar solo ese tipo
		const hasHotelIdentifiers = /\[HOTEL:[^\]]+\]/gi.test(text);
		const hasRestaurantIdentifiers = /\[RESTAURANTE:[^\]]+\]/gi.test(text);
		const hasPlaceIdentifiers = /\[LUGAR:[^\]]+\]/gi.test(text);

		if (hasHotelIdentifiers && hotels.length > 0) {
			console.log("🏨 [DEBUG] Filtro: Solo hoteles por identificadores");
			return {
				touristPlaces: [],
				hotels: hotels,
				restaurants: [],
				hasAnyPlaces: hotels.length > 0,
				filterType: "hotels",
			};
		}

		if (hasRestaurantIdentifiers && restaurants.length > 0) {
			console.log("🍽️ [DEBUG] Filtro: Solo restaurantes por identificadores");
			return {
				touristPlaces: [],
				hotels: [],
				restaurants: restaurants,
				hasAnyPlaces: restaurants.length > 0,
				filterType: "restaurants",
			};
		}

		if (hasPlaceIdentifiers && touristPlaces.length > 0) {
			console.log(
				"🏛️ [DEBUG] Filtro: Solo lugares turísticos por identificadores"
			);
			return {
				touristPlaces: touristPlaces,
				hotels: [],
				restaurants: [],
				hasAnyPlaces: touristPlaces.length > 0,
				filterType: "places",
			};
		}

		// Prioridad 2: Si no hay identificadores, pero el usuario pregunta específicamente
		const normalizedText = text.toLowerCase();

		// Detectar preguntas específicas por hoteles
		const hotelQuestionKeywords = [
			"donde puedo hospedarme",
			"donde quedarme",
			"donde dormir",
			"hoteles",
			"hotel",
			"hospedaje",
			"alojamiento",
		];

		const isAskingForHotels = hotelQuestionKeywords.some((keyword) =>
			normalizedText.includes(keyword)
		);

		if (isAskingForHotels && hotels.length > 0) {
			console.log("🏨 [DEBUG] Filtro: Solo hoteles por pregunta específica");
			return {
				touristPlaces: [],
				hotels: hotels,
				restaurants: [],
				hasAnyPlaces: hotels.length > 0,
				filterType: "hotels",
			};
		}

		// Detectar preguntas específicas por restaurantes
		const restaurantQuestionKeywords = [
			"donde puedo comer",
			"donde comer",
			"donde almorzar",
			"donde cenar",
			"restaurantes",
			"restaurante",
			"comida",
			"comer",
			"gastronomía",
		];

		const isAskingForRestaurants = restaurantQuestionKeywords.some((keyword) =>
			normalizedText.includes(keyword)
		);

		if (isAskingForRestaurants && restaurants.length > 0) {
			console.log(
				"🍽️ [DEBUG] Filtro: Solo restaurantes por pregunta específica"
			);
			return {
				touristPlaces: [],
				hotels: [],
				restaurants: restaurants,
				hasAnyPlaces: restaurants.length > 0,
				filterType: "restaurants",
			};
		}

		// Prioridad 3: Solo lugares turísticos (por defecto)
		if (touristPlaces.length > 0) {
			console.log("🏛️ [DEBUG] Filtro: Solo lugares turísticos por defecto");
			return {
				touristPlaces: touristPlaces,
				hotels: [],
				restaurants: [],
				hasAnyPlaces: touristPlaces.length > 0,
				filterType: "places",
			};
		}

		// Si no hay nada, retornar vacío
		console.log(
			"❌ [DEBUG] Filtro: No se encontró ningún tipo de establecimiento"
		);
		return {
			touristPlaces: [],
			hotels: [],
			restaurants: [],
			hasAnyPlaces: false,
			filterType: "none",
		};
	}

	// Determinar si debe mostrar cards basado en el contenido (con filtro)
	shouldShowAnyCards(text) {
		if (!text) return false;

		console.log("🎯 [DEBUG] Evaluando si mostrar cards para:", text);

		// Usar la lógica de extracción con filtro para determinar si mostrar cards
		const extractedPlaces = this.extractAllFromText(text);
		const shouldShow = extractedPlaces.hasAnyPlaces;

		console.log("📊 [DEBUG] Resultado del filtro:", {
			filterType: extractedPlaces.filterType,
			shouldShow: shouldShow,
			places: extractedPlaces.touristPlaces.length,
			hotels: extractedPlaces.hotels.length,
			restaurants: extractedPlaces.restaurants.length,
		});

		return shouldShow;
	}

	// Determinar si debe mostrar cards de hoteles
	shouldShowHotelCards(text) {
		if (!text) return false;

		const normalizedText = text.toLowerCase();
		console.log("🏨 [DEBUG] Evaluando hoteles para:", normalizedText);

		// Verificar identificadores específicos de hoteles
		const hasHotelIdentifiers = /\[HOTEL:[^\]]+\]/gi.test(text);
		if (hasHotelIdentifiers) {
			console.log("✅ [DEBUG] Encontrado identificador de hotel");
			return true;
		}

		// Detectar cuando el usuario pregunta específicamente por hoteles
		const hotelQuestionKeywords = [
			"donde puedo hospedarme",
			"donde quedarme",
			"donde dormir",
			"hoteles",
			"hotel",
			"hospedaje",
			"alojamiento",
			"reservar hotel",
			"busco hotel",
			"quiero hospedarme",
			"necesito alojamiento",
		];

		const isAskingForHotels = hotelQuestionKeywords.some((keyword) =>
			normalizedText.includes(keyword)
		);

		console.log("🏨 [DEBUG] ¿Pregunta por hoteles?:", isAskingForHotels);
		return isAskingForHotels;
	}

	// Determinar si debe mostrar cards de restaurantes
	shouldShowRestaurantCards(text) {
		if (!text) return false;

		const normalizedText = text.toLowerCase();
		console.log("🍽️ [DEBUG] Evaluando restaurantes para:", normalizedText);

		// Verificar identificadores específicos de restaurantes
		const hasRestaurantIdentifiers = /\[RESTAURANTE:[^\]]+\]/gi.test(text);
		if (hasRestaurantIdentifiers) {
			console.log("✅ [DEBUG] Encontrado identificador de restaurante");
			return true;
		}

		// Detectar cuando el usuario pregunta específicamente por restaurantes
		const restaurantQuestionKeywords = [
			"donde puedo comer",
			"donde comer",
			"donde almorzar",
			"donde cenar",
			"restaurantes",
			"restaurante",
			"comida",
			"comer",
			"busco restaurante",
			"quiero comer",
			"necesito comer",
			"gastronomía",
			"platos típicos",
			"comida típica",
		];

		const isAskingForRestaurants = restaurantQuestionKeywords.some((keyword) =>
			normalizedText.includes(keyword)
		);

		console.log(
			"🍽️ [DEBUG] ¿Pregunta por restaurantes?:",
			isAskingForRestaurants
		);
		return isAskingForRestaurants;
	}

	// Generar mensaje combinado para la respuesta del bot (con filtro)
	generateCombinedCardsMessage(extracted) {
		const { touristPlaces, hotels, restaurants, filterType } = extracted;
		const totalPlaces =
			touristPlaces.length + hotels.length + restaurants.length;

		if (totalPlaces === 0) {
			return null;
		}

		// Mensaje específico según el tipo filtrado
		switch (filterType) {
			case "hotels":
				return `Información detallada de ${hotels.length} hotel${
					hotels.length > 1 ? "es" : ""
				} recomendado${hotels.length > 1 ? "s" : ""}`;

			case "restaurants":
				return `Información detallada de ${restaurants.length} restaurante${
					restaurants.length > 1 ? "s" : ""
				} recomendado${restaurants.length > 1 ? "s" : ""}`;

			case "places":
				return `Información detallada de ${touristPlaces.length} lugar${
					touristPlaces.length > 1 ? "es" : ""
				} turístico${touristPlaces.length > 1 ? "s" : ""} recomendado${
					touristPlaces.length > 1 ? "s" : ""
				}`;

			default:
				// Fallback al comportamiento anterior (aunque no debería ocurrir con el filtro)
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
						`${restaurants.length} restaurante${
							restaurants.length > 1 ? "s" : ""
						}`
					);
				}

				if (parts.length > 0) {
					message += ` de ${parts.join(", ")}`;
				}

				return message;
		}
	}
}

export default new UnifiedExtractionService();
