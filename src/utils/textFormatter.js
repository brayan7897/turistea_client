// Utilidades para formatear texto de respuestas del chatbot

class TextFormatter {
	// Formatear texto de respuestas para mejor legibilidad
	static formatChatResponse(text) {
		if (!text || typeof text !== "string") return text;

		let formattedText = text
			// Limpiar espacios extras
			.trim()
			.replace(/\s+/g, " ")

			// Mejorar formato de listas
			.replace(/(\d+\.)\s*/g, "\n$1 ")
			.replace(/(-)\s*/g, "\n• ")

			// Asegurar saltos de línea antes de nuevas oraciones importantes
			.replace(/\.\s*([A-ZÀ-Ÿ])/g, ".\n\n$1")

			// Formatear nombres de lugares en negritas (para markdown)
			.replace(
				/\b(Kotosh|Plaza de Armas|Tingo María|Cueva de las Lechuzas|Bella Durmiente|Puente Calicanto|Catedral|Yarowilca|Laguna Lauricocha|Carpish)\b/gi,
				"**$1**"
			)

			// Formatear preguntas
			.replace(/(\?)\s*([A-ZÀ-Ÿ])/g, "$1\n\n$2")

			// Limpiar múltiples saltos de línea
			.replace(/\n{3,}/g, "\n\n")
			.trim();

		return formattedText;
	}

	// Convertir texto con markdown básico a HTML
	static markdownToHtml(text) {
		if (!text) return text;

		return (
			text
				// Texto en negritas
				.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

				// Texto en cursiva
				.replace(/\*(.*?)\*/g, "<em>$1</em>")

				// Saltos de línea
				.replace(/\n/g, "<br>")

				// Enlaces (básico)
				.replace(
					/\[([^\]]+)\]\(([^)]+)\)/g,
					'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
				)
		);
	}

	// Truncar texto si es muy largo
	static truncateText(text, maxLength = 500) {
		if (!text || text.length <= maxLength) return text;

		return text.substring(0, maxLength).trim() + "...";
	}

	// Limpiar respuestas duplicadas o redundantes
	static removeDuplicateInfo(text) {
		if (!text) return text;

		// Dividir en oraciones
		const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

		// Remover oraciones muy similares
		const uniqueSentences = [];

		sentences.forEach((sentence) => {
			const cleanSentence = sentence.toLowerCase().trim();
			const isDuplicate = uniqueSentences.some(
				(existing) =>
					this.similarity(cleanSentence, existing.toLowerCase()) > 0.8
			);

			if (!isDuplicate && cleanSentence.length > 10) {
				uniqueSentences.push(sentence.trim());
			}
		});

		return uniqueSentences.join(". ") + (uniqueSentences.length > 0 ? "." : "");
	}

	// Función auxiliar para calcular similitud entre textos
	static similarity(s1, s2) {
		const longer = s1.length > s2.length ? s1 : s2;
		const shorter = s1.length > s2.length ? s2 : s1;

		if (longer.length === 0) return 1.0;

		const editDistance = this.editDistance(longer, shorter);
		return (longer.length - editDistance) / longer.length;
	}

	// Función auxiliar para calcular distancia de edición
	static editDistance(s1, s2) {
		s1 = s1.toLowerCase();
		s2 = s2.toLowerCase();

		const costs = [];
		for (let i = 0; i <= s2.length; i++) {
			let lastValue = i;
			for (let j = 0; j <= s1.length; j++) {
				if (i === 0) {
					costs[j] = j;
				} else {
					if (j > 0) {
						let newValue = costs[j - 1];
						if (s1.charAt(j - 1) !== s2.charAt(i - 1)) {
							newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
						}
						costs[j - 1] = lastValue;
						lastValue = newValue;
					}
				}
			}
			if (i > 0) {
				costs[s1.length] = lastValue;
			}
		}
		return costs[s1.length];
	}

	// Función principal para procesar respuestas del chatbot
	static processResponse(text) {
		if (!text) return text;

		// Aplicar todas las mejoras de formato
		let processed = this.removeDuplicateInfo(text);
		processed = this.formatChatResponse(processed);
		processed = this.truncateText(processed, 400); // Límite más corto

		return processed;
	}

	// Formatear texto para mostrar en componentes React
	static formatForReact(text) {
		if (!text) return text;

		const processed = this.processResponse(text);
		return this.markdownToHtml(processed);
	}
}

export default TextFormatter;
