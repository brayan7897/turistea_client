import axios from "axios";
import touristPlacesService from "./touristPlacesService";
import unifiedExtractionService from "./unifiedExtractionService";
import TextFormatter from "../utils/textFormatter";
import ResponseFormatter from "../utils/responseFormatter";
import LocationConfig from "./locationConfig";

class OpenAIService {
	constructor() {
		this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
		this.baseURL = "https://api.openai.com/v1";
	}

	// Método para enviar mensaje a GPT-4o-mini
	async sendMessage(message, conversationHistory = [], userLocation = null) {
		try {
			// Generar contexto de ubicación
			const locationContext =
				LocationConfig.generateLocationContext(userLocation);
			console.log("📍 [DEBUG] Contexto de ubicación:", locationContext);

			// Construir el array de mensajes incluyendo el historial
			const messages = [
				{
					role: "system",
					content: `Eres TuristeaBot, asistente turístico de Huánuco, Perú.

UBICACIÓN DEL USUARIO: ${locationContext.context}
COORDENADAS ACTUALES: ${locationContext.current.formatted}

LUGARES TURÍSTICOS DISPONIBLES: [LUGAR:Kotosh], [LUGAR:Plaza de Armas], [LUGAR:Catedral], [LUGAR:Puente Calicanto], [LUGAR:Tingo María], [LUGAR:Cueva de las Lechuzas], [LUGAR:Bella Durmiente], [LUGAR:Yarowilca], [LUGAR:Laguna Lauricocha], [LUGAR:Carpish].

HOTELES DISPONIBLES: [HOTEL:Gran Hotel Huánuco], [HOTEL:Hotel Majestic], [HOTEL:Hotel Los Portales], [HOTEL:Hotel Villa Tingo], [HOTEL:Shushupe Hotel], [HOTEL:Grima Hotel], [HOTEL:Hospedaje El Cantaro II], [HOTEL:Cabañas del Bosque - Huamalíes], [HOTEL:Hostal Dos de Mayo Histórico], [HOTEL:Refugio Tomay Kichwa].

RESTAURANTES DISPONIBLES: [RESTAURANTE:El Fogón de la Abuela], [RESTAURANTE:Pizzería Don Vito], [RESTAURANTE:Chifa Palacio de Oro], [RESTAURANTE:La Olla de Barro], [RESTAURANTE:Café Cultural Kotosh], [RESTAURANTE:Yuraq Wasi Restobar], [RESTAURANTE:Sazón de Huamalíes], [RESTAURANTE:El Mirador de Dos de Mayo].

INSTRUCCIONES IMPORTANTES:
- Respuestas CORTAS y CONCISAS (máximo 3-4 oraciones)
- ANALIZA la consulta del usuario para responder EXACTAMENTE lo que pide
- SOLO menciona lugares turísticos si pregunta por: sitios, lugares, atracciones, qué visitar, turismo
- SOLO menciona hoteles si pregunta por: hospedaje, dormir, alojamiento, hoteles, donde quedarme
- SOLO menciona restaurantes si pregunta por: comida, comer, restaurantes, gastronomía, donde comer
- Usa identificadores SOLO cuando sea relevante: [LUGAR:Nombre], [HOTEL:Nombre], [RESTAURANTE:Nombre]
- NO combines tipos si la pregunta es específica
- Usa formato con saltos de línea para mejor legibilidad
- Considera la ubicación del usuario para dar recomendaciones más precisas

EJEMPLOS CORRECTOS:
Pregunta: "¿Qué lugares puedo visitar?"
Respuesta: "Te recomiendo visitar [LUGAR:Kotosh], famoso por el Templo de las Manos Cruzadas, y [LUGAR:Tingo María] con sus hermosos paisajes naturales."

Pregunta: "¿Dónde puedo hospedarme?"
Respuesta: "Para hospedarte recomiendo [HOTEL:Gran Hotel Huánuco] en el centro de la ciudad o [HOTEL:Hotel Majestic] que tiene excelente servicio."

Pregunta: "¿Dónde puedo comer?"
Respuesta: "Para comer te sugiero [RESTAURANTE:El Fogón de la Abuela] con los mejores platos típicos o [RESTAURANTE:Café Cultural Kotosh] para una experiencia más cultural."

CRÍTICO: Responde SOLO lo que el usuario pregunta. No agregues información no solicitada.`,
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
					model: "gpt-4o-mini",
					messages: messages,
					max_tokens: 300,
					temperature: 0.5,
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

			console.log("🤖 [DEBUG] Respuesta de GPT:", responseMessage);
			console.log("🔍 [DEBUG] Pregunta del usuario:", message);

			// Extraer todos los tipos de lugares ANTES de formatear la respuesta
			const extractedPlaces =
				unifiedExtractionService.extractAllFromText(responseMessage);
			const shouldShowCards =
				unifiedExtractionService.shouldShowAnyCards(responseMessage);

			console.log("📊 [DEBUG] Lugares extraídos:", extractedPlaces);
			console.log("🎯 [DEBUG] ¿Debe mostrar cards?:", shouldShowCards);

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
					model: "gpt-4o-mini",
					messages: messages,
					max_tokens: 300,
					temperature: 0.5,
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
		// Usar la ubicación por defecto si no se proporciona una
		const finalLocation = userLocation || LocationConfig.getDefaultLocation();
		const locationContext =
			LocationConfig.generateLocationContext(finalLocation);

		const contextualMessage = `${locationContext.context}. ${query}`;

		return this.sendMessage(contextualMessage, [], finalLocation);
	}
}

export default new OpenAIService();
