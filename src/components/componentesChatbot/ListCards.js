import CardSelector from "./CardSelector";

const ListCards = () => {
	// Cards de ejemplo con información completa
	const cards = [
		{
			structValue: {
				fields: {
					title: { stringValue: "Complejo Arqueológico de Kotosh" },
					imageUrl: {
						stringValue:
							"https://www.tuentrada.com.pe/wp-content/uploads/2023/09/Complejo-arqueologico-Kotosh.jpg",
					},
					subtitle: {
						stringValue:
							"Kotosh es un sitio arqueológico ubicado a 5 km de la ciudad de Huánuco. Es famoso por el 'Templo de las Manos Cruzadas', una estructura ceremonial de más de 4,000 años de antigüedad.",
					},
					buttonUrl: {
						stringValue: "Km 5 Oeste, Huánuco",
					},
					activities: {
						stringValue: "Visitas guiadas, fotografía, estudio arqueológico",
					},
					tips: {
						stringValue:
							"Mejor visitarlo en las mañanas. Llevar protector solar y agua.",
					},
					rating: { stringValue: "4.7" },
					coordinates: { stringValue: "-9.9300,-76.2600" },
					type: { stringValue: "atraccion" },
				},
			},
		},
		{
			structValue: {
				fields: {
					title: { stringValue: "Plaza de Armas de Huánuco" },
					imageUrl: {
						stringValue:
							"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/5c/plaza-de-armas-de-huanuco.jpg",
					},
					subtitle: {
						stringValue:
							"La Plaza de Armas es el corazón de la ciudad de Huánuco. Rodeada de edificios coloniales y republicanos, alberga la Catedral y el Palacio Municipal.",
					},
					buttonUrl: {
						stringValue: "Jr. Dos de Mayo, Huánuco",
					},
					activities: {
						stringValue: "Paseos, fotografía, eventos culturales, gastronomía",
					},
					tips: {
						stringValue:
							"Ideal para visitar por las tardes. Hay muchos restaurantes y cafeterías alrededor.",
					},
					rating: { stringValue: "4.6" },
					coordinates: { stringValue: "-9.9305,-76.2390" },
					type: { stringValue: "atraccion" },
				},
			},
		},
		{
			structValue: {
				fields: {
					title: { stringValue: "Cueva de las Lechuzas" },
					imageUrl: {
						stringValue:
							"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/15/0a/42/cueva-de-las-lechuzas.jpg",
					},
					subtitle: {
						stringValue:
							"Una impresionante cueva natural habitada por aves nocturnas llamadas guácharos (conocidas localmente como lechuzas). La cueva tiene formaciones rocosas espectaculares.",
					},
					buttonUrl: {
						stringValue: "Parque Nacional Tingo María",
					},
					activities: {
						stringValue:
							"Espeleología, observación de fauna, fotografía, ecoturismo",
					},
					tips: {
						stringValue:
							"Usar linterna, calzado antideslizante y ropa que se pueda ensuciar.",
					},
					rating: { stringValue: "4.7" },
					coordinates: { stringValue: "-9.2800,-75.9900" },
					type: { stringValue: "aventura" },
				},
			},
		},
	];

	return (
		<div className="w-full mb-3">
			<div className="h-80 flex gap-2 w-full overflow-x-auto overflow-y-hidden no-scrollbar px-2 pb-2">
				{cards.map((card, i) => {
					if (card?.structValue?.fields) {
						return (
							<CardSelector
								item={card.structValue.fields}
								type="place"
								key={i}
							/>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
};

export default ListCards;
