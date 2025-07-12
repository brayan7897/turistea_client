import firebaseData from "../assets/json/firebase-db.json";

class TouristPlacesService {
	constructor() {
		// Cargar datos de lugares turísticos desde el JSON
		this.placesData = firebaseData.lugares || {};
		this.placesDatabase = this.buildPlacesDatabase();
	}

	// Construir base de datos de lugares desde el JSON
	buildPlacesDatabase() {
		const database = {};

		Object.values(this.placesData).forEach((place) => {
			// Crear entradas para cada keyword del lugar
			if (place.keywords && Array.isArray(place.keywords)) {
				place.keywords.forEach((keyword) => {
					database[keyword.toLowerCase()] = {
						title: place.nombre,
						description: place.descripcion,
						location: place.direccion,
						activities: place.actividades || "Información no disponible",
						tips: place.consejos || "Información no disponible",
						imageUrl: place.imagen || "",
						calificacion: place.calificacion || 0,
						coordenadas: place.coordenadas || "",
						ciudad: place.ciudad || "",
						telefono: place.telefono || "",
						website: place.url || "",
						tipo: place.tipo || "atraccion",
						originalData: place,
					};
				});
			}

			// También crear entrada con el nombre completo del lugar
			const placeName = place.nombre.toLowerCase();
			database[placeName] = {
				title: place.nombre,
				description: place.descripcion,
				location: place.direccion,
				activities: place.actividades || "Información no disponible",
				tips: place.consejos || "Información no disponible",
				imageUrl: place.imagen || "",
				calificacion: place.calificacion || 0,
				coordenadas: place.coordenadas || "",
				ciudad: place.ciudad || "",
				telefono: place.telefono || "",
				website: place.url || "",
				tipo: place.tipo || "atraccion",
				originalData: place,
			};
		});

		return database;
	}

	// Extraer lugares turísticos de una respuesta de texto
	extractTouristPlaces(text) {
		if (!text) return [];

		const places = [];
		const foundPlaceIds = new Set(); // Para evitar duplicados por ID
		const foundPlaceNames = new Set(); // Para evitar duplicados por nombre
		const normalizedText = text.toLowerCase();

		// Primero buscar identificadores específicos [LUGAR:Nombre]
		const placeIdentifierRegex = /\[LUGAR:([^\]]+)\]/gi;
		let match;
		while ((match = placeIdentifierRegex.exec(text)) !== null) {
			const placeName = match[1].trim();
			const normalizedPlaceName = placeName.toLowerCase();

			// Buscar el lugar en la base de datos
			const placeInfo = this.placesDatabase[normalizedPlaceName];

			if (placeInfo) {
				const placeId =
					placeInfo.originalData?.id ||
					placeInfo.originalData?.nombre ||
					normalizedPlaceName;

				if (
					!foundPlaceIds.has(placeId) &&
					!foundPlaceNames.has(normalizedPlaceName)
				) {
					foundPlaceIds.add(placeId);
					foundPlaceNames.add(normalizedPlaceName);

					places.push({
						key: normalizedPlaceName,
						...placeInfo,
						imageUrl: placeInfo.imageUrl || "",
						uniqueId: placeId,
					});
				}
			}
		}

		// Si ya encontramos lugares con identificadores, retornar solo esos
		if (places.length > 0) {
			return this.validateUniquesByName(places);
		}

		// Buscar menciones de lugares en el texto usando keywords solo si no hay identificadores
		for (const [key, info] of Object.entries(this.placesDatabase)) {
			if (normalizedText.includes(key)) {
				// Usar múltiples identificadores únicos para evitar duplicados
				const placeId =
					info.originalData?.id || info.originalData?.nombre || key;
				const placeName = info.title?.toLowerCase() || key;

				// Verificar si ya hemos agregado este lugar por cualquier criterio
				if (!foundPlaceIds.has(placeId) && !foundPlaceNames.has(placeName)) {
					foundPlaceIds.add(placeId);
					foundPlaceNames.add(placeName);

					places.push({
						key: key,
						...info,
						imageUrl: info.imageUrl || "", // Ya viene del JSON
						uniqueId: placeId, // Agregar ID único para tracking
					});
				}
			}
		}

		// Limitar a máximo 4 lugares para evitar saturación
		const uniquePlaces = places.slice(0, 4);

		// Si no encuentra lugares específicos, buscar palabras clave generales
		if (uniquePlaces.length === 0) {
			const generalKeywords = [
				"huánuco",
				"huanuco",
				"lugares turísticos",
				"sitios",
				"visitar",
				"turismo",
				"atractivos",
				"destinos",
			];

			const hasGeneralKeywords = generalKeywords.some((keyword) =>
				normalizedText.includes(keyword)
			);

			if (hasGeneralKeywords) {
				// Retornar algunos lugares principales por defecto desde el JSON
				const defaultPlaces = this.getDefaultPlaces();
				return this.validateUniquesByName(defaultPlaces.slice(0, 3)); // Máximo 3 lugares por defecto
			}
		}

		return this.validateUniquesByName(uniquePlaces);
	}

	// Método auxiliar para validar lugares únicos por nombre
	validateUniquesByName(places) {
		const seenNames = new Set();
		return places.filter((place) => {
			const name = place.title?.toLowerCase();
			if (seenNames.has(name)) {
				return false;
			}
			seenNames.add(name);
			return true;
		});
	}

	// Obtener lugares por defecto para mostrar
	getDefaultPlaces() {
		const defaultKeys = ["kotosh", "plaza de armas", "tingo maria"];
		const places = [];

		defaultKeys.forEach((key) => {
			if (this.placesDatabase[key]) {
				places.push({
					key: key,
					...this.placesDatabase[key],
				});
			}
		});

		// Si no encuentra los lugares por defecto, tomar los primeros 3 disponibles
		if (places.length === 0) {
			const allPlaceNames = Object.keys(this.placesDatabase);
			allPlaceNames.slice(0, 3).forEach((key) => {
				places.push({
					key: key,
					...this.placesDatabase[key],
				});
			});
		}

		return places;
	}

	// Convertir información de lugar a formato de card
	placeToCardFormat(place) {
		return {
			structValue: {
				fields: {
					title: { stringValue: place.title },
					imageUrl: { stringValue: place.imageUrl },
					subtitle: { stringValue: place.description },
					buttonUrl: { stringValue: place.location },
					activities: { stringValue: place.activities },
					tips: { stringValue: place.tips },
					rating: { stringValue: place.calificacion?.toString() || "" },
					coordinates: { stringValue: place.coordenadas },
					city: { stringValue: place.ciudad },
					phone: { stringValue: place.telefono },
					website: { stringValue: place.website },
					type: { stringValue: place.tipo },
				},
			},
		};
	}

	// Generar cards desde respuesta de OpenAI
	generateCardsFromResponse(openaiResponse) {
		const places = this.extractTouristPlaces(openaiResponse);
		return places.map((place) => this.placeToCardFormat(place));
	}

	// Detectar si una respuesta amerita mostrar cards
	shouldShowCards(text) {
		if (!text) return false;

		// Palabras clave básicas que activan cards
		const cardTriggerWords = [
			"lugares",
			"sitios",
			"visitar",
			"turísticos",
			"destinos",
			"atractivos",
			"recomiendo",
			"puedes ir",
			"conocer",
			"ver",
		];

		const normalizedText = text.toLowerCase();

		// Verificar palabras clave básicas
		const hasBasicTriggers = cardTriggerWords.some((word) =>
			normalizedText.includes(word)
		);

		// Verificar si menciona alguno de los lugares específicos
		const mentionsSpecificPlace = Object.keys(this.placesDatabase).some(
			(place) => normalizedText.includes(place)
		);

		return hasBasicTriggers || mentionsSpecificPlace;
	}

	// Agregar nuevo lugar a la base de datos (método mantenido para compatibilidad)
	addPlace(key, placeInfo) {
		this.placesDatabase[key.toLowerCase()] = placeInfo;
	}

	// Obtener información de un lugar específico
	getPlaceInfo(placeName) {
		const normalizedName = placeName.toLowerCase().trim();
		return this.placesDatabase[normalizedName] || null;
	}

	// Obtener todos los lugares disponibles
	getAllPlaces() {
		return Object.keys(this.placesDatabase);
	}

	// Obtener todos los lugares desde el JSON original
	getAllPlacesFromJson() {
		return Object.values(this.placesData);
	}

	// Buscar lugares por keyword específico
	searchPlacesByKeyword(keyword) {
		const normalizedKeyword = keyword.toLowerCase();
		const matchingPlaces = [];

		Object.values(this.placesData).forEach((place) => {
			if (
				place.keywords &&
				place.keywords.some((k) => k.toLowerCase().includes(normalizedKeyword))
			) {
				matchingPlaces.push(place);
			}
		});

		return matchingPlaces;
	}

	// Obtener lugar por ID específico del JSON
	getPlaceById(placeId) {
		return this.placesData[placeId] || null;
	}
}

export default new TouristPlacesService();
