import axios from "axios";
import touristPlacesService from "./touristPlacesService";
import unifiedExtractionService from "./unifiedExtractionService";
import TextFormatter from "../utils/textFormatter";
import ResponseFormatter from "../utils/responseFormatter";

class OpenAIService {
	constructor() {
		this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
		this.baseURL = "https://api.openai.com/v1";
	}

	// Método para enviar mensaje a GPT-3.5 Turbo
	async sendMessage(message, conversationHistory = []) {
		try {
			// Construir el array de mensajes incluyendo el historial
			const messages = [
				{
					role: "system",
					content: `Eres TuristeaBot, asistente turístico de Huánuco, Perú.

LUGARES TURÍSTICOS DISPONIBLES: [LUGAR:Kotosh], [LUGAR:Plaza de Armas], [LUGAR:Catedral], [LUGAR:Puente Calicanto], [LUGAR:Tingo María], [LUGAR:Cueva de las Lechuzas], [LUGAR:Bella Durmiente], [LUGAR:Yarowilca], [LUGAR:Laguna Lauricocha], [LUGAR:Carpish].

HOTELES DISPONIBLES: [HOTEL:Gran Hotel Huánuco], [HOTEL:Hotel Majestic], [HOTEL:Hotel Los Portales], [HOTEL:Hotel Grand Palladium], [HOTEL:Hostal El Viajero].

RESTAURANTES DISPONIBLES: [RESTAURANTE:El Fogón de la Abuela], [RESTAURANTE:Pizzería Don Vito], [RESTAURANTE:Chifa Palacio de Oro], [RESTAURANTE:Restaurant El Huallaga], [RESTAURANTE:Café de la Plaza].

INSTRUCCIONES IMPORTANTES:
- Respuestas CORTAS y CONCISAS (máximo 3-4 oraciones)
- Cuando menciones lugares turísticos, usa el formato: [LUGAR:Nombre Exacto]
- Cuando menciones hoteles, usa el formato: [HOTEL:Nombre Exacto]
- Cuando menciones restaurantes, usa el formato: [RESTAURANTE:Nombre Exacto]
- Usa formato con saltos de línea para mejor legibilidad
- Los detalles completos se mostrarán en los cards automáticamente
- Sé directo y útil

EJEMPLO CORRECTO:
"Te recomiendo visitar [LUGAR:Kotosh], famoso por el Templo de las Manos Cruzadas. 

Para hospedarte, [HOTEL:Gran Hotel Huánuco] está muy bien ubicado en el centro.

Para comer, [RESTAURANTE:El Fogón de la Abuela] tiene los mejores platos típicos huanuqueños."

IMPORTANTE: Siempre usa los identificadores [LUGAR:], [HOTEL:], [RESTAURANTE:] para que se muestren los cards correctos.`,
				},
				...conversationHistory,
				{
					role: "user",
					content: message,
				},
			];

			const response = await axios.post(
				`${this.baseURL}/chat/completions`,
				{
					model: "gpt-3.5-turbo",
					messages: messages,
					max_tokens: 300,
					temperature: 0.6,
					top_p: 0.9,
					frequency_penalty: 0.3,
					presence_penalty: 0.3,
				},
				{
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			const responseMessage = response.data.choices[0].message.content;

			// Extraer todos los tipos de lugares ANTES de formatear la respuesta
			const extractedPlaces =
				unifiedExtractionService.extractAllFromText(responseMessage);
			const shouldShowCards =
				unifiedExtractionService.shouldShowAnyCards(responseMessage);

			// Formatear la respuesta para mostrar al usuario (eliminar identificadores)
			const formattedMessage =
				ResponseFormatter.formatForDisplay(responseMessage);
			const enhancedMessage = TextFormatter.processResponse(formattedMessage);

			return {
				success: true,
				message: enhancedMessage,
				usage: response.data.usage,
				extractedPlaces: extractedPlaces,
				touristPlaces: extractedPlaces.touristPlaces, // Mantener compatibilidad
				shouldShowCards: shouldShowCards && extractedPlaces.hasAnyPlaces,
			};
		} catch (error) {
			console.error("Error al comunicarse con OpenAI:", error);
			return {
				success: false,
				error:
					error.response?.data?.error?.message ||
					error.message ||
					"Error desconocido",
			};
		}
	}

	// Método alternativo usando fetch (más ligero)
	async sendMessageWithFetch(message, conversationHistory = []) {
		try {
			const messages = [
				{
					role: "system",
					content:
						"Eres TuristeaBot, asistente turístico de Huánuco, Perú. Responde de forma CONCISA (máximo 3 oraciones). Menciona lugares específicos como Kotosh, Plaza de Armas, Tingo María, etc. Usa formato claro con saltos de línea. Los detalles se mostrarán en cards automáticamente.",
				},
				...conversationHistory,
				{
					role: "user",
					content: message,
				},
			];

			const response = await fetch(`${this.baseURL}/chat/completions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "gpt-3.5-turbo",
					messages: messages,
					max_tokens: 300,
					temperature: 0.6,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error?.message || "Error en la respuesta de OpenAI"
				);
			}

			const data = await response.json();
			const responseMessage = data.choices[0].message.content;

			// Extraer todos los tipos de lugares ANTES de formatear la respuesta
			const extractedPlaces =
				unifiedExtractionService.extractAllFromText(responseMessage);
			const shouldShowCards =
				unifiedExtractionService.shouldShowAnyCards(responseMessage);

			// Formatear la respuesta para mostrar al usuario (eliminar identificadores)
			const formattedMessage =
				ResponseFormatter.formatForDisplay(responseMessage);
			const enhancedMessage = TextFormatter.processResponse(formattedMessage);

			return {
				success: true,
				message: enhancedMessage,
				usage: data.usage,
				extractedPlaces: extractedPlaces,
				shouldShowCards: shouldShowCards && extractedPlaces.hasAnyPlaces,
			};
		} catch (error) {
			console.error("Error al comunicarse con OpenAI:", error);
			return {
				success: false,
				error: error.message || "Error desconocido",
			};
		}
	}

	// Método para generar respuestas con contexto turístico específico
	async getTouristInfo(query, userLocation = null) {
		let contextualMessage = query;

		if (userLocation) {
			contextualMessage = `El usuario se encuentra en las coordenadas ${userLocation.lat}, ${userLocation.lng}. ${query}`;
		}

		const systemPrompt = `Eres TuristeaBot, un asistente turístico especializado en Huánuco, Perú. Tu objetivo es:
    - Proporcionar información precisa sobre lugares turísticos
    - Recomendar actividades y experiencias
    - Ayudar con direcciones y ubicaciones
    - Sugerir rutas turísticas
    - Dar consejos prácticos para viajeros
    
    Si el usuario pregunta sobre su ubicación o mapas, menciona que puedes mostrarle un mapa interactivo.
    Responde siempre en español de manera amigable y profesional.`;

		return this.sendMessage(contextualMessage, [], systemPrompt);
	}
}

export default new OpenAIService();
