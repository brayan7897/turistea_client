import CardSelector from "./CardSelector";

const DynamicListCards = ({ places = [], filterType = "mixed" }) => {
	// Debug inicial: verificar qué datos están llegando
	console.log("🎯 [DEBUG] DynamicListCards recibió:", {
		filterType,
		placesCount: places.length,
		places: places,
	});

	// Si no hay lugares, no mostrar nada
	if (!places || places.length === 0) {
		console.log("❌ [DEBUG] No hay places para mostrar");
		return null;
	}

	// Función para determinar el tipo de card basado en filterType y estructura de datos
	const determineCardType = (place) => {
		// PRIORIDAD 1: Si el filterType especifica un tipo único, usarlo SIEMPRE
		if (filterType === "hotels") {
			console.log("🏨 [DEBUG] Tipo determinado por filterType: hotel");
			return "hotel";
		}
		if (filterType === "restaurants") {
			console.log("🍽️ [DEBUG] Tipo determinado por filterType: restaurant");
			return "restaurant";
		}
		if (filterType === "places") {
			console.log("🏛️ [DEBUG] Tipo determinado por filterType: place");
			return "place";
		}

		// PRIORIDAD 2: Si es mixed, determinar por la estructura de datos
		// Buscar en formato stringValue primero
		const typeValue = place.type?.stringValue || place.tipo;
		if (typeValue === "hotel") {
			console.log("🏨 [DEBUG] Tipo determinado por type field: hotel");
			return "hotel";
		}
		if (typeValue === "restaurante") {
			console.log("🍽️ [DEBUG] Tipo determinado por type field: restaurant");
			return "restaurant";
		}

		// Buscar por propiedades específicas de hoteles
		if (
			place.servicios ||
			place.services ||
			place.precio_rango ||
			place.priceRange
		) {
			console.log("🏨 [DEBUG] Tipo determinado por propiedades de hotel");
			return "hotel";
		}

		// Buscar por propiedades específicas de restaurantes
		if (
			place.especialidad ||
			place.cuisine ||
			place.cocina ||
			place.especialidades ||
			place.ambiente
		) {
			console.log("🍽️ [DEBUG] Tipo determinado por propiedades de restaurante");
			return "restaurant";
		}

		// Por defecto, lugar turístico
		console.log("🏛️ [DEBUG] Tipo determinado por defecto: place");
		return "place";
	};

	// Función para formatear datos según el tipo de card
	const formatDataForCard = (place, cardType) => {
		// Función auxiliar para extraer valores (maneja tanto stringValue como valores directos)
		const extractValue = (value) => {
			console.log(
				"🔧 [DEBUG] extractValue input:",
				value,
				"type:",
				typeof value
			);

			if (
				value &&
				typeof value === "object" &&
				value.stringValue !== undefined
			) {
				console.log(
					"🔧 [DEBUG] extractValue stringValue found:",
					value.stringValue
				);
				return value.stringValue;
			}

			console.log("🔧 [DEBUG] extractValue direct value:", value || "");
			return value || "";
		};

		switch (cardType) {
			case "hotel":
				// Los datos de hoteles pueden venir en formato stringValue o directo
				return {
					nombre: extractValue(place.title) || place.nombre || "",
					descripcion: extractValue(place.subtitle) || place.descripcion || "",
					direccion: extractValue(place.location) || place.direccion || "",
					ciudad: extractValue(place.city) || place.ciudad || "",
					coordenadas:
						extractValue(place.coordinates) || place.coordenadas || "",
					calificacion:
						parseFloat(extractValue(place.rating)) || place.calificacion || 0,
					telefono: extractValue(place.phone) || place.telefono || "",
					url: extractValue(place.website) || place.url || "",
					imagen: extractValue(place.imageUrl) || place.imagen || "",
					actividades:
						extractValue(place.activities) || place.actividades || "",
					consejos: extractValue(place.tips) || place.consejos || "",
					precio_rango: place.priceRange || place.precio_rango || "",
					servicios: place.services || place.servicios || [],
					destacado: place.featured || place.destacado || false,
					tipo: extractValue(place.type) || place.tipo || "hotel",
				};

			case "restaurant":
				// Los datos de restaurantes pueden venir en formato stringValue o directo
				return {
					nombre: extractValue(place.title) || place.nombre || "",
					descripcion: extractValue(place.subtitle) || place.descripcion || "",
					direccion: extractValue(place.location) || place.direccion || "",
					ciudad: extractValue(place.city) || place.ciudad || "",
					coordenadas:
						extractValue(place.coordinates) || place.coordenadas || "",
					calificacion:
						parseFloat(extractValue(place.rating)) || place.calificacion || 0,
					telefono: extractValue(place.phone) || place.telefono || "",
					url: extractValue(place.website) || place.url || "",
					imagen: extractValue(place.imageUrl) || place.imagen || "",
					actividades:
						extractValue(place.activities) || place.actividades || "",
					consejos: extractValue(place.tips) || place.consejos || "",
					precio_rango: place.priceRange || place.precio_rango || "",
					especialidad:
						place.cuisine || place.cocina || place.especialidad || "",
					especialidades: place.especialidades || [],
					horario: place.horario || "",
					capacidad: place.capacidad || "",
					ambiente: place.ambiente || "",
					destacado: place.featured || place.destacado || false,
					tipo: extractValue(place.type) || place.tipo || "restaurante",
				};

			case "place":
			default:
				// Debug específico para verificar nombres de propiedades
				console.log("� [DEBUG] Verificando nombres de propiedades:", {
					todas_las_propiedades: Object.keys(place),
					place_buttonUrl: place.buttonUrl,
					place_location: place.location, // ¿Será que viene como location?
					place_direccion: place.direccion,
					place_structValue: place.structValue?.fields?.buttonUrl, // ¿O en structValue?
				});

				// Convertir al formato que espera PlaceCard (con stringValue)
				const placeData = {
					title: {
						stringValue: extractValue(place.title) || place.nombre || `Lugar`,
					},
					imageUrl: {
						stringValue: extractValue(place.imageUrl) || place.imagen || "",
					},
					subtitle: {
						stringValue:
							extractValue(place.subtitle) || place.descripcion || "",
					},
					buttonUrl: {
						stringValue: extractValue(place.location) || place.direccion || "",
					},
					activities: {
						stringValue:
							extractValue(place.activities) || place.actividades || "",
					},
					tips: {
						stringValue: extractValue(place.tips) || place.consejos || "",
					},
					rating: {
						stringValue:
							extractValue(place.rating) ||
							place.calificacion?.toString() ||
							"",
					},
					coordinates: {
						stringValue:
							extractValue(place.coordinates) || place.coordenadas || "",
					},
					type: {
						stringValue: extractValue(place.type) || place.tipo || "atraccion",
					},
					city: { stringValue: extractValue(place.city) || place.ciudad || "" },
					phone: {
						stringValue: extractValue(place.phone) || place.telefono || "",
					},
					website: {
						stringValue: extractValue(place.website) || place.url || "",
					},
				};

				console.log("🏛️ [DEBUG] Datos formateados para PlaceCard:", placeData);
				return placeData;
		}
	};

	// Función para obtener el título del contenedor según el tipo
	const getContainerTitle = () => {
		switch (filterType) {
			case "hotels":
				return "🏨 Hoteles";
			case "restaurants":
				return "🍽️ Restaurantes";
			case "places":
				return "🏛️ Lugares Turísticos";
			default:
				return "📍 Resultados";
		}
	};

	return (
		<div className="w-full mb-3">
			{/* Título del contenedor basado en el tipo */}
			{filterType !== "mixed" && (
				<div className="px-2 mb-2">
					<h3 className="text-sm font-semibold text-gray-700">
						{getContainerTitle()} ({places.length})
					</h3>
				</div>
			)}

			<div className="w-full">
				<div className="h-80 flex gap-2 w-full overflow-x-auto overflow-y-hidden no-scrollbar px-2 pb-2">
					{places.map((place, i) => {
						const cardType = determineCardType(place);
						const formattedData = formatDataForCard(place, cardType);

						// Debug: verificar datos
						console.log(`[DEBUG] Card ${i}:`, {
							cardType,
							originalPlace: place,
							formattedData,
						});

						return (
							<CardSelector
								item={formattedData}
								type={cardType}
								key={`${cardType}-${i}`}
							/>
						);
					})}
				</div>
				{places.length > 1 && (
					<p className="text-center text-xs text-gray-500 mt-2 px-2">
						Desliza para ver más{" "}
						{filterType !== "mixed" ? filterType : "resultados"} (
						{places.length} en total)
					</p>
				)}
			</div>
		</div>
	);
};

export default DynamicListCards;
