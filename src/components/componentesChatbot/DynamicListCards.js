import Card from "./card";

const DynamicListCards = ({ places = [] }) => {
	// Si no hay lugares, no mostrar nada
	if (!places || places.length === 0) {
		return null;
	}

	// Convertir los lugares al formato esperado por Card
	const formatPlacesForCards = (places) => {
		return places.map((place, index) => {
			// Si ya viene con el formato correcto (hoteles/restaurantes desde nearbyService)
			if (place.title?.stringValue && place.subtitle?.stringValue) {
				return {
					structValue: {
						fields: {
							title: place.title,
							imageUrl: place.imageUrl,
							subtitle: place.subtitle,
							buttonUrl: place.buttonUrl,
							activities: place.activities,
							tips: place.tips,
							rating: place.rating,
							coordinates: place.coordinates,
							type: place.type,
							city: place.city,
							phone: place.phone,
							website: place.website,
						},
					},
				};
			}

			// Si es formato de lugares turísticos
			return {
				structValue: {
					fields: {
						title: { stringValue: place.title || `Lugar ${index + 1}` },
						imageUrl: { stringValue: place.imageUrl || "" },
						subtitle: {
							stringValue: place.description || place.subtitle || "",
						},
						buttonUrl: { stringValue: place.location || place.buttonUrl || "" },
						activities: { stringValue: place.activities || "" },
						tips: { stringValue: place.tips || "" },
						rating: {
							stringValue:
								place.calificacion?.toString() ||
								place.originalData?.calificacion?.toString() ||
								"",
						},
						coordinates: {
							stringValue:
								place.coordenadas || place.originalData?.coordenadas || "",
						},
						type: { stringValue: place.originalData?.tipo || "atraccion" },
						city: {
							stringValue: place.ciudad || place.originalData?.ciudad || "",
						},
						phone: {
							stringValue: place.telefono || place.originalData?.telefono || "",
						},
						website: {
							stringValue: place.website || place.originalData?.url || "",
						},
					},
				},
			};
		});
	};

	const formattedCards = formatPlacesForCards(places);

	return (
		<div className="w-full mb-3">
			<div className="w-full">
				<div className="h-80 flex gap-2 w-full overflow-x-auto overflow-y-hidden no-scrollbar px-2 pb-2">
					{formattedCards.map((card, i) => {
						if (card?.structValue?.fields) {
							return <Card card={card.structValue.fields} key={i} />;
						}
						return null;
					})}
				</div>
				{places.length > 1 && (
					<p className="text-center text-xs text-gray-500 mt-2 px-2">
						Desliza para ver más lugares ({places.length} en total)
					</p>
				)}
			</div>
		</div>
	);
};

export default DynamicListCards;
