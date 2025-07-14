import React from "react";
import PlaceCard from "./PlaceCard";
import HotelCard from "./HotelCard";
import RestaurantCard from "./RestaurantCard";

function CardSelector({ item, type }) {
	// Debug: verificar qué datos están llegando
	console.log(`[DEBUG] CardSelector recibió:`, { type, item });

	// Si se especifica un tipo explícito, usarlo
	if (type) {
		switch (type) {
			case "hotel":
				console.log(`[DEBUG] Renderizando HotelCard con:`, item);
				return <HotelCard hotel={item} />;
			case "restaurant":
			case "restaurante":
				console.log(`[DEBUG] Renderizando RestaurantCard con:`, item);
				return <RestaurantCard restaurant={item} />;
			case "place":
			case "lugar":
			default:
				console.log(`[DEBUG] Renderizando PlaceCard con:`, item);
				return <PlaceCard card={item} />;
		}
	}

	// Si no hay tipo explícito, intentar determinar por la estructura de datos
	if (item) {
		// Verificar si es un hotel por propiedades específicas
		if (
			item.servicios ||
			item.precio_rango ||
			(item.tipo && item.tipo === "hotel")
		) {
			return <HotelCard hotel={item} />;
		}

		// Verificar si es un restaurante por propiedades específicas
		if (
			item.especialidad ||
			item.ambiente ||
			item.capacidad ||
			(item.tipo && item.tipo === "restaurante")
		) {
			return <RestaurantCard restaurant={item} />;
		}

		// Por defecto, tratar como lugar turístico
		return <PlaceCard card={item} />;
	}

	return null;
}

export default CardSelector;
