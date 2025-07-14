import { useState, useEffect, useRef } from "react";
import generalContext from "../contex/generalContext";
import MapContext from "../contex/mapContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Mensajes from "./componentesChatbot/Mensajes";
import ListCards from "./componentesChatbot/ListCards";
import DynamicListCards from "./componentesChatbot/DynamicListCards";
import QuickResponseBadges from "./componentesChatbot/QuickResponseBadges";
import MapaCard from "./componentesChatbot/MapaCard";
import MapaInteractivo from "./MapaInteractivo";
import LocationConfig from "../services/locationConfig";
import imgfondo from "../assets/img/imagenfondo1.svg";
import imgfondo1450px from "../assets/img/imgturistea3.svg";
import imgInicio from "../assets/img/Travelers-pana.png";
import { v4 as uuidv4 } from "uuid";
import quickResponsesService from "../services/quickResponsesService";

const Chatbot = () => {
	const generalsContext = useContext(generalContext);
	const mapContext = useContext(MapContext);
	const {
		chatCompleto,
		isLoadingResponse,
		enviarMensajeAOpenAI,
		enviarMensajeAOpenAISinAgregarUsuario,
		agregarMensaje,
		eliminarMensaje,
	} = generalsContext;
	const {
		destination,
		showMap,
		setShowMap,
		userLocation: mapUserLocation,
		setUserLocation: setMapUserLocation,
		clearDestination,
	} = mapContext;
	const [mensaje, guardarMensaje] = useState({ texto: "" });
	const [cerrarInicio, setCerrarInicio] = useState(false);

	// Ubicación por defecto en el centro de Huánuco (Plaza de Armas)
	const defaultLocation = LocationConfig.getDefaultLocation();
	const [userLocation, setUserLocation] = useState(defaultLocation);

	const [quickResponses, setQuickResponses] = useState([]);
	const [lastCardQuery, setLastCardQuery] = useState(null); // Para evitar duplicados
	// Esta bandera evitará que los mensajes de ejemplo se carguen más de una vez
	const mensajesYaCargados = useRef(false);

	// Función para cargar las pre-respuestas iniciales del chatbot
	const cargarMensajesIniciales = () => {
		// Verificar si los mensajes ya fueron cargados
		if (mensajesYaCargados.current) return;

		// Marcar como cargados para que no se repita
		mensajesYaCargados.current = true;

		// Cargar respuestas rápidas disponibles
		const responses = quickResponsesService.getQuickResponses();
		setQuickResponses(responses);

		setTimeout(() => {
			// Mensaje de bienvenida del bot
			agregarMensaje({
				id: uuidv4(),
				who: "bot",
				content: {
					text: {
						text: "¡Hola! Soy tu guía turístico virtual de Huánuco 🌟 \n\nEstoy configurado con tu ubicación en el centro de la ciudad para darte las mejores recomendaciones.\n\nPuedes preguntarme sobre lugares turísticos, actividades, recomendaciones y mucho más. También puedes usar los botones rápidos de abajo para obtener información inmediata.",
					},
				},
			});

			// Mensaje adicional explicativo
			setTimeout(() => {
				agregarMensaje({
					id: uuidv4(),
					who: "bot",
					content: {
						text: {
							text: "Usa los botones de abajo para explorar rápidamente o escribe tu propia pregunta. ¡Estoy aquí para ayudarte a descubrir Huánuco! 🗺️",
						},
					},
				});
			}, 1000);
		}, 1000);
	};

	// Función para manejar la selección de respuestas rápidas
	const handleQuickResponseSelect = async (message, quickResponse) => {
		// Agregar mensaje del usuario inmediatamente
		agregarMensaje({
			id: uuidv4(),
			who: "user",
			content: {
				text: {
					text: message,
				},
			},
		});

		// Si es una respuesta asíncrona (hoteles/restaurantes)
		if (quickResponse.isAsync && quickResponse.asyncMethod) {
			// Mostrar mensaje de carga
			const loadingMessageId = uuidv4();
			agregarMensaje({
				id: loadingMessageId,
				who: "bot",
				content: {
					text: {
						text: quickResponse.message,
					},
				},
			});

			try {
				// Ejecutar método asíncrono
				const result = await quickResponse.asyncMethod();

				// Eliminar mensaje de carga
				eliminarMensaje(loadingMessageId);

				// Determinar tipo de respuesta y generar mensaje apropiado
				let botMessage = "";
				let places = [];

				if (quickResponse.id === "nearby-hotels") {
					botMessage =
						"🏨 **Hoteles disponibles cerca de ti:**\n\nHe encontrado estos hoteles con excelentes servicios y ubicación conveniente.";
					places = result;
				} else if (quickResponse.id === "nearby-restaurants") {
					botMessage =
						"🍽️ **Restaurantes recomendados cerca de ti:**\n\nAquí tienes opciones gastronómicas deliciosas para todos los gustos.";
					places = result;
				} else if (quickResponse.id === "nearby-all") {
					const totalPlaces = [...result.hotels, ...result.restaurants];
					botMessage = `🏪 **Hoteles y restaurantes cercanos:**\n\nHe encontrado ${result.hotels.length} hoteles y ${result.restaurants.length} restaurantes cerca de tu ubicación.`;
					places = totalPlaces;
				}

				// Agregar mensaje del bot con información
				agregarMensaje({
					id: uuidv4(),
					who: "bot",
					content: {
						text: {
							text: botMessage,
						},
					},
				});

				// Método auxiliar para validar si debemos mostrar cards
				const shouldShowCards = (queryType, places) => {
					// No mostrar si no hay lugares
					if (!places || places.length === 0) {
						return false;
					}

					// No mostrar si es la misma consulta reciente (evitar duplicados)
					if (lastCardQuery === queryType) {
						console.log(`Evitando duplicar cards para: ${queryType}`);
						return false;
					}

					// Actualizar última consulta
					setLastCardQuery(queryType);

					// Limpiar el flag después de 10 segundos para permitir nueva consulta
					setTimeout(() => {
						setLastCardQuery(null);
					}, 10000);

					return true;
				};

				// Mostrar cards si hay resultados y no se duplican
				if (places.length > 0 && shouldShowCards(quickResponse.id, places)) {
					setTimeout(() => {
						agregarMensaje({
							id: uuidv4(),
							who: "bot",
							isDynamicCardsMessage: true,
							touristPlaces: places,
						});
					}, 500);
				}
			} catch (error) {
				console.error("Error ejecutando respuesta asíncrona:", error);

				// Eliminar mensaje de carga
				eliminarMensaje(loadingMessageId);

				// Mostrar mensaje de error
				agregarMensaje({
					id: uuidv4(),
					who: "bot",
					content: {
						text: {
							text: "Lo siento, hubo un problema al buscar la información. Por favor, intenta de nuevo más tarde.",
						},
					},
				});
			}
		} else {
			// Para respuestas normales, usar el método que NO agrega el mensaje del usuario
			await enviarMensajeAOpenAISinAgregarUsuario(message, userLocation);
		}
	};

	const onchangeMensaje = (e) => {
		guardarMensaje({
			...mensaje,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmitMensaje = async (e) => {
		e.preventDefault();

		if (mensaje.texto.trim() === "") {
			return;
		}

		// Enviar mensaje a OpenAI
		await enviarMensajeAOpenAI(mensaje.texto, userLocation);

		// Limpiar el input
		guardarMensaje({ texto: "" });
	};

	// Función para manejar cambio de ubicación del usuario
	const handleLocationChange = (location) => {
		// Validar y usar ubicación válida o la por defecto
		const validLocation = LocationConfig.getValidLocationOrDefault(
			location?.lat,
			location?.lng
		);

		setUserLocation(validLocation);
		setMapUserLocation(validLocation);

		console.log("📍 [DEBUG] Ubicación actualizada:", validLocation);
	};

	// Función para manejar información de ruta calculada
	const handleRouteCalculated = (routeInfo) => {
		// Agregar mensaje del bot con información de la ruta
		agregarMensaje({
			id: uuidv4(),
			who: "bot",
			content: {
				text: {
					text: `🧭 **Ruta calculada hacia ${destination?.title}**\n\n📏 Distancia: ${routeInfo.distance}\n⏱️ Tiempo estimado: ${routeInfo.duration}\n\n¡La ruta se muestra en el mapa interactivo!`,
				},
			},
		});
	};

	const esconderVentana = () => {
		setCerrarInicio(true);
		// Cargar los mensajes iniciales cuando se hace clic en "Ingresa ahora"
		cargarMensajesIniciales();
	};

	// useEffect para mostrar el mapa automáticamente cuando se selecciona un destino
	useEffect(() => {
		if (destination && showMap) {
			// Verificar si ya hay un mensaje de mapa visible
			const hasMapMessage = chatCompleto.some((chat) => chat.isMapMessage);

			if (!hasMapMessage) {
				// Agregar mensaje del mapa automáticamente
				agregarMensaje({
					id: uuidv4(),
					who: "bot",
					isMapMessage: true,
					content: {
						text: {
							text: `🗺️ **Mostrando ${destination.title} en el mapa**\n\nAquí puedes ver la ubicación exacta del lugar seleccionado.`,
						},
					},
				});
			}
		}
	}, [destination, showMap]);

	return (
		<section className="w-[64.94%] h-[100vh] gap-[2.5%] flex flex-row items-center justify-center relative pl-[4.375rem] max-[1450px]:w-[60%] max-[1450px]:pl-[5%] max-[1000px]:pl-[0%]  max-[1000px]:w-full max-[1000px]:justify-center">
			<div className="h-[85%] w-full absolute px-5 z-10 overflow-visible">
				<img
					className=" object-cover max-[1500px]:hidden px-10"
					src={imgfondo}
					alt="Chat background"></img>
				<img
					className="object-cover hidden max-[1450px]:flex max-[500px]:hidden"
					src={imgfondo1450px}
					alt="Chat background for medium screens"></img>
			</div>
			<div className="h-[731px] w-[480px] shadow-coloro1 border-t-8 border-solid border-colorb rounded-2xl shadow-lg bg-colorb flex flex-col relative z-20 max-[500px]:w-[400px] max-[500px]:h-[731px] max-[500px]:border-solid max-[500px]:border-[3px] max-[500px]:border-colorc2 max-[500px]:mb-4 overflow-hidden">
				<section className="bg-white overflow-y-auto overflow-x-hidden custom-scrollbar flex-1">
					<div className="p-4 space-y-4 min-h-full w-full max-w-full">
						{chatCompleto.map((chat, index) => {
							if (!chat) return null;

							// Si es un mensaje marcado como cards estáticos, mostramos el componente ListCards
							if (chat.isCardsMessage) {
								return <ListCards key={chat.id || index} />;
							}

							// Si es un mensaje marcado como cards dinámicos, mostramos DynamicListCards
							if (chat.isDynamicCardsMessage) {
								// Con el nuevo sistema de filtros, solo un tipo debería tener datos
								const touristPlaces = chat.touristPlaces || [];
								const hotels = chat.hotels || [];
								const restaurants = chat.restaurants || [];

								// Determinar qué tipo de cards mostrar basado en el contenido
								if (hotels.length > 0) {
									return (
										<DynamicListCards
											key={`hotels-${chat.id || index}`}
											places={hotels}
											filterType="hotels"
										/>
									);
								} else if (restaurants.length > 0) {
									return (
										<DynamicListCards
											key={`restaurants-${chat.id || index}`}
											places={restaurants}
											filterType="restaurants"
										/>
									);
								} else if (touristPlaces.length > 0) {
									return (
										<DynamicListCards
											key={`places-${chat.id || index}`}
											places={touristPlaces}
											filterType="places"
										/>
									);
								}
							}

							// Si es un mensaje marcado como mapa, mostramos el componente MapaCard
							if (chat.isMapMessage) {
								return (
									<div key={chat.id || index}>
										<MapaCard />
									</div>
								);
							}

							// Si es un mensaje normal, mostramos Mensajes
							if (chat.content?.text) {
								return <Mensajes key={chat.id || index} chat={chat} />;
							}

							return null;
						})}

						{/* Indicador de carga cuando está esperando respuesta de OpenAI */}
						{isLoadingResponse && (
							<div className="flex justify-start">
								<div className="flex max-w-[90%] justify-self-start p-3 shadow-sm bg-colorm gap-4 rounded-t-2xl rounded-br-2xl break-words">
									<div className="w-8 h-8 rounded-full bg-colorc2 text-colorb flex items-center justify-center text-xs font-bold flex-shrink-0">
										TR
									</div>
									<div className="flex items-center space-x-1">
										<div className="flex space-x-1">
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: "0.1s" }}></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: "0.2s" }}></div>
										</div>
										<span className="text-sm text-gray-500 ml-2">
											Escribiendo...
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</section>

				{/* Badges de respuestas rápidas encima del input - solo cuando el chat está activo */}
				{cerrarInicio && quickResponses.length > 0 && (
					<QuickResponseBadges
						onQuickResponseSelect={handleQuickResponseSelect}
						responses={quickResponses}
					/>
				)}

				<footer className="rounded-b-2xl bg-white p-2">
					<form onSubmit={onSubmitMensaje}>
						<div className="flex h-10">
							<input
								onChange={onchangeMensaje}
								value={mensaje.texto}
								name="texto"
								type="text"
								className="w-full p-4 rounded-bl-2xl outline-none"
								placeholder="Escriba su mensaje..."></input>

							<button
								className="w-20 disabled:opacity-50"
								type="submit"
								disabled={isLoadingResponse}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-send mx-auto px-2 pb-1"
									width="44"
									height="44"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#545151"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<line x1="10" y1="14" x2="21" y2="3" />
									<path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
								</svg>
							</button>
						</div>
					</form>
				</footer>
				<section
					className={`bg-colorb w-full h-full rounded-2xl absolute flex flex-col items-center justify-between pb-[20%] transition-transform duration-100 ${
						cerrarInicio && "transform scale-y-0"
					}`}>
					<div className="w-[83.33%] h-[52.84%]">
						<img
							src={imgInicio}
							className="object-cover"
							alt="Welcome illustration"></img>
					</div>
					<button
						className="w-[83.33%] h-[3rem] bg-colorc2 text-colorb rounded-lg font-bold text-xl"
						onClick={esconderVentana}>
						Ingresa ahora
					</button>
				</section>
			</div>
			<div className="z-20 max-[1450px]:hidden m-7 w-[500px] h-[500px]">
				<MapaInteractivo onLocationChange={setUserLocation} />
			</div>
		</section>
	);
};

export default Chatbot;
