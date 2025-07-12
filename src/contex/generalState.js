import { useReducer } from "react";
import generalContext from "./generalContext";
import generalReducer from "./generalReducer";
import { AGREGAR_M, ELIMINAR_M, SET_LOADING, SET_ERROR } from "../types";
import { v4 as uuidv4 } from "uuid";
import openaiService from "../services/openaiService";
import unifiedExtractionService from "../services/unifiedExtractionService";

const GeneralState = (props) => {
	const initialState = {
		chatCompleto: [],
		isLoadingResponse: false,
		error: null,
		lastCardsAdded: null, // Timestamp para evitar duplicados
	};

	const [state, dispatch] = useReducer(generalReducer, initialState);

	// Validar si debemos agregar cards (evitar duplicados en corto tiempo)
	const shouldAddCards = (extractedPlaces) => {
		const now = Date.now();
		const timeSinceLastCards = state.lastCardsAdded
			? now - state.lastCardsAdded
			: Infinity;
		const minimumInterval = 3000; // 3 segundos mínimo entre cards

		// No agregar si es muy reciente o si no hay lugares
		if (
			timeSinceLastCards < minimumInterval ||
			!extractedPlaces ||
			!extractedPlaces.hasAnyPlaces
		) {
			return false;
		}

		return true;
	};

	const agregarMensaje = (mensaje) => {
		mensaje.id = uuidv4();
		dispatch({
			type: AGREGAR_M,
			payload: mensaje,
		});
	};

	const eliminarMensaje = (mensajeId) => {
		dispatch({
			type: ELIMINAR_M,
			payload: mensajeId,
		});
	};

	const setLoading = (isLoading) => {
		dispatch({
			type: SET_LOADING,
			payload: isLoading,
		});
	};

	const setError = (error) => {
		dispatch({
			type: SET_ERROR,
			payload: error,
		});
	};

	// Función para enviar mensaje a OpenAI
	const enviarMensajeAOpenAI = async (mensaje, userLocation = null) => {
		try {
			setLoading(true);
			setError(null);

			// Agregar el mensaje del usuario primero
			agregarMensaje({
				who: "user",
				content: {
					text: {
						text: mensaje,
					},
				},
			});

			// Construir historial de conversación para OpenAI
			const conversationHistory = state.chatCompleto
				.filter(
					(chat) =>
						chat.content?.text?.text &&
						!chat.isCardsMessage &&
						!chat.isMapMessage
				)
				.map((chat) => ({
					role: chat.who === "bot" ? "assistant" : "user",
					content: chat.content.text.text,
				}));

			// Enviar a OpenAI
			const response = await openaiService.sendMessage(
				mensaje,
				conversationHistory
			);

			if (response.success) {
				// Agregar la respuesta del bot
				agregarMensaje({
					who: "bot",
					content: {
						text: {
							text: response.message,
						},
					},
				});

				// Si hay lugares detectados (turísticos, hoteles, restaurantes), mostrar cards (con validación anti-duplicados)
				if (
					response.shouldShowCards &&
					response.extractedPlaces &&
					response.extractedPlaces.hasAnyPlaces &&
					shouldAddCards(response.extractedPlaces)
				) {
					// Actualizar timestamp de última adición de cards
					dispatch({
						type: "SET_LAST_CARDS_ADDED",
						payload: Date.now(),
					});

					setTimeout(() => {
						const { touristPlaces, hotels, restaurants } =
							response.extractedPlaces;
						const combinedMessage =
							unifiedExtractionService.generateCombinedCardsMessage(
								response.extractedPlaces
							);

						agregarMensaje({
							isDynamicCardsMessage: true,
							who: "bot",
							touristPlaces: touristPlaces,
							hotels: hotels,
							restaurants: restaurants,
							content: {
								text: {
									text: combinedMessage || "Información detallada de lugares",
								},
							},
						});
					}, 500);
				}

				// Si la respuesta menciona mapa o ubicación, agregar mapa
				const palabrasClaveUbicacion = [
					"mapa",
					"ubicación",
					"ubicacion",
					"localización",
					"localizacion",
					"mostrar mapa",
					"ver mapa",
				];
				const mencionaMapa = palabrasClaveUbicacion.some((palabra) =>
					response.message.toLowerCase().includes(palabra)
				);

				if (mencionaMapa) {
					setTimeout(() => {
						agregarMensaje({
							isMapMessage: true,
							who: "bot",
							content: {
								text: {
									text: "Mapa interactivo",
								},
							},
						});
					}, 500);
				}
			} else {
				// Manejar error de OpenAI
				agregarMensaje({
					who: "bot",
					content: {
						text: {
							text: `Lo siento, hubo un problema al procesar tu mensaje: ${response.error}. Puedo ayudarte con información básica sobre Huánuco.`,
						},
					},
				});
				setError(response.error);
			}
		} catch (error) {
			console.error("Error en enviarMensajeAOpenAI:", error);
			agregarMensaje({
				who: "bot",
				content: {
					text: {
						text: "Lo siento, hubo un error al procesar tu mensaje. ¿Puedes intentar de nuevo?",
					},
				},
			});
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Función para enviar mensaje a OpenAI sin agregar mensaje del usuario (para respuestas rápidas)
	const enviarMensajeAOpenAISinAgregarUsuario = async (
		mensaje,
		userLocation = null
	) => {
		try {
			setLoading(true);
			setError(null);

			// NO agregar el mensaje del usuario aquí (ya se agregó manualmente)

			// Construir historial de conversación para OpenAI
			const conversationHistory = state.chatCompleto
				.filter(
					(chat) =>
						chat.content?.text?.text &&
						!chat.isCardsMessage &&
						!chat.isMapMessage
				)
				.map((chat) => ({
					role: chat.who === "bot" ? "assistant" : "user",
					content: chat.content.text.text,
				}));

			// Enviar a OpenAI
			const response = await openaiService.sendMessage(
				mensaje,
				conversationHistory
			);

			if (response.success) {
				// Agregar la respuesta del bot
				agregarMensaje({
					who: "bot",
					content: {
						text: {
							text: response.message,
						},
					},
				});

				// Si hay lugares detectados (turísticos, hoteles, restaurantes), mostrar cards (con validación anti-duplicados)
				if (
					response.shouldShowCards &&
					response.extractedPlaces &&
					response.extractedPlaces.hasAnyPlaces &&
					shouldAddCards(response.extractedPlaces)
				) {
					// Actualizar timestamp de última adición de cards
					dispatch({
						type: "SET_LAST_CARDS_ADDED",
						payload: Date.now(),
					});

					setTimeout(() => {
						const { touristPlaces, hotels, restaurants } =
							response.extractedPlaces;
						const combinedMessage =
							unifiedExtractionService.generateCombinedCardsMessage(
								response.extractedPlaces
							);

						agregarMensaje({
							isDynamicCardsMessage: true,
							who: "bot",
							touristPlaces: touristPlaces,
							hotels: hotels,
							restaurants: restaurants,
							content: {
								text: {
									text: combinedMessage || "Información detallada de lugares",
								},
							},
						});
					}, 500);
				}

				// Si la respuesta menciona mapa o ubicación, agregar mapa
				const palabrasClaveUbicacion = [
					"mapa",
					"ubicación",
					"ubicacion",
					"localización",
					"localizacion",
					"mostrar mapa",
					"ver mapa",
				];
				const mencionaMapa = palabrasClaveUbicacion.some((palabra) =>
					response.message.toLowerCase().includes(palabra)
				);

				if (mencionaMapa) {
					setTimeout(() => {
						agregarMensaje({
							isMapMessage: true,
							who: "bot",
							content: {
								text: {
									text: "Aquí tienes el mapa interactivo",
								},
							},
						});
					}, 1000);
				}
			} else {
				agregarMensaje({
					who: "bot",
					content: {
						text: {
							text:
								response.error ||
								"Lo siento, hubo un error al procesar tu mensaje.",
						},
					},
				});
			}
		} catch (error) {
			console.error("Error en enviarMensajeAOpenAISinAgregarUsuario:", error);
			agregarMensaje({
				who: "bot",
				content: {
					text: {
						text: "Lo siento, hubo un error al procesar tu mensaje. ¿Puedes intentar de nuevo?",
					},
				},
			});
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<generalContext.Provider
			value={{
				chatCompleto: state.chatCompleto,
				isLoadingResponse: state.isLoadingResponse,
				error: state.error,
				agregarMensaje,
				eliminarMensaje,
				enviarMensajeAOpenAI,
				enviarMensajeAOpenAISinAgregarUsuario,
				setLoading,
				setError,
			}}>
			{props.children}
		</generalContext.Provider>
	);
};

export default GeneralState;
