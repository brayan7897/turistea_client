class ResponseFormatter {
	/**
	 * Formatea la respuesta de OpenAI eliminando los identificadores específicos
	 * y aplicando el formato apropiado para mostrar al usuario
	 */
	static formatForDisplay(text) {
		if (!text) return text;

		let formattedText = text;

		// Eliminar identificadores y reemplazar con formato markdown
		formattedText = formattedText.replace(/\[LUGAR:([^\]]+)\]/g, "**$1**");
		formattedText = formattedText.replace(/\[HOTEL:([^\]]+)\]/g, "**$1**");
		formattedText = formattedText.replace(
			/\[RESTAURANTE:([^\]]+)\]/g,
			"**$1**"
		);

		return formattedText;
	}

	/**
	 * Extrae todos los identificadores del texto para propósitos de debugging
	 */
	static extractIdentifiers(text) {
		if (!text) return { places: [], hotels: [], restaurants: [] };

		const places = [];
		const hotels = [];
		const restaurants = [];

		// Extraer lugares
		const placeMatches = text.matchAll(/\[LUGAR:([^\]]+)\]/g);
		for (const match of placeMatches) {
			places.push(match[1].trim());
		}

		// Extraer hoteles
		const hotelMatches = text.matchAll(/\[HOTEL:([^\]]+)\]/g);
		for (const match of hotelMatches) {
			hotels.push(match[1].trim());
		}

		// Extraer restaurantes
		const restaurantMatches = text.matchAll(/\[RESTAURANTE:([^\]]+)\]/g);
		for (const match of restaurantMatches) {
			restaurants.push(match[1].trim());
		}

		return { places, hotels, restaurants };
	}

	/**
	 * Verifica si el texto contiene algún identificador
	 */
	static hasIdentifiers(text) {
		if (!text) return false;

		const identifierRegex = /\[(LUGAR|HOTEL|RESTAURANTE):[^\]]+\]/g;
		return identifierRegex.test(text);
	}

	/**
	 * Limpia completamente el texto eliminando todos los identificadores
	 */
	static cleanText(text) {
		if (!text) return text;

		return text.replace(/\[(LUGAR|HOTEL|RESTAURANTE):[^\]]+\]/g, "");
	}

	/**
	 * Aplica formato de texto mejorado (usado por TextFormatter existente)
	 */
	static enhanceTextFormat(text) {
		if (!text) return text;

		let enhanced = text;

		// Mejorar formato de listas
		enhanced = enhanced.replace(/^\s*[-•*]\s+/gm, "• ");

		// Mejorar espaciado después de títulos con **
		enhanced = enhanced.replace(/(\*\*[^*]+\*\*)\s*\n/g, "$1\n\n");

		// Asegurar espaciado correcto entre párrafos
		enhanced = enhanced.replace(/\n\n\n+/g, "\n\n");

		// Limpiar espacios al inicio y final
		enhanced = enhanced.trim();

		return enhanced;
	}
}

export default ResponseFormatter;
