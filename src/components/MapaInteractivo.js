import React, { useState, useEffect, useRef, useContext } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapContext from "../contex/mapContext";
import LocationConfig from "../services/locationConfig";

// Componente interno del mapa - Simplificado
const MapComponent = ({ center, zoom }) => {
	const mapRef = useRef(null);
	const googleMapRef = useRef(null);
	const destinationMarkerRef = useRef(null);
	const { destination } = useContext(MapContext);

	useEffect(() => {
		// Crear el mapa con estilos mejorados
		if (mapRef.current && !googleMapRef.current) {
			googleMapRef.current = new window.google.maps.Map(mapRef.current, {
				center: center,
				zoom: zoom,
				mapTypeId: "roadmap",
				disableDefaultUI: false,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: true,
				streetViewControl: true,
				rotateControl: true,
				fullscreenControl: true,
				styles: [
					// Estilo personalizado más elegante
					{
						featureType: "all",
						elementType: "geometry",
						stylers: [{ color: "#f5f5f5" }],
					},
					{
						featureType: "poi",
						elementType: "labels",
						stylers: [{ visibility: "on" }],
					},
					{
						featureType: "poi.business",
						stylers: [{ visibility: "on" }],
					},
					{
						featureType: "landscape",
						elementType: "all",
						stylers: [{ color: "#f0f7ff" }],
					},
					{
						featureType: "road",
						elementType: "all",
						stylers: [{ saturation: -70 }, { lightness: 45 }],
					},
					{
						featureType: "road.highway",
						elementType: "all",
						stylers: [{ color: "#4a90e2" }, { saturation: -40 }],
					},
					{
						featureType: "road.arterial",
						elementType: "labels.icon",
						stylers: [{ visibility: "off" }],
					},
					{
						featureType: "water",
						elementType: "all",
						stylers: [{ color: "#46bcec" }, { visibility: "on" }],
					},
					{
						featureType: "transit",
						elementType: "all",
						stylers: [{ visibility: "on" }],
					},
					{
						featureType: "administrative",
						elementType: "labels.text.fill",
						stylers: [{ color: "#444444" }],
					},
				],
			});
		}
	}, [center, zoom]);

	// Efecto para mostrar el destino cuando cambia
	useEffect(() => {
		if (destination && googleMapRef.current) {
			// Limpiar marcador anterior
			if (destinationMarkerRef.current) {
				destinationMarkerRef.current.setMap(null);
			}

			// Crear nuevo marcador en el destino con diseño personalizado
			const position = { lat: destination.lat, lng: destination.lng };

			// Crear icono SVG personalizado
			const customIcon = {
				url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
					<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" style="stop-color:#4a90e2;stop-opacity:1" />
								<stop offset="100%" style="stop-color:#357abd;stop-opacity:1" />
							</linearGradient>
						</defs>
						<path d="M20 0C8.954 0 0 8.954 0 20c0 20 20 30 20 30s20-10 20-30C40 8.954 31.046 0 20 0z" fill="url(#grad1)" stroke="#ffffff" stroke-width="2"/>
						<circle cx="20" cy="20" r="8" fill="#ffffff"/>
						<circle cx="20" cy="20" r="4" fill="#4a90e2"/>
					</svg>
				`)}`,
				scaledSize: new window.google.maps.Size(40, 50),
				anchor: new window.google.maps.Point(20, 50),
			};

			destinationMarkerRef.current = new window.google.maps.Marker({
				position: position,
				map: googleMapRef.current,
				title: destination.title,
				icon: customIcon,
				animation: window.google.maps.Animation.DROP,
			});

			// Crear ventana de información con mejor diseño
			const infoWindow = new window.google.maps.InfoWindow({
				content: `
					<div style="
						padding: 16px; 
						max-width: 280px; 
						font-family: 'Inter', sans-serif;
						background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
						border-radius: 12px;
						box-shadow: 0 4px 12px rgba(0,0,0,0.15);
						border: 2px solid #4a90e2;
					">
						<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
							<div style="
								background: linear-gradient(135deg, #4a90e2, #357abd);
								color: white;
								width: 32px;
								height: 32px;
								border-radius: 50%;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 14px;
								font-weight: bold;
							">📍</div>
							<h3 style="
								margin: 0; 
								color: #1e293b; 
								font-size: 18px; 
								font-weight: bold;
								text-shadow: 0 1px 2px rgba(0,0,0,0.1);
							">
								${destination.title}
							</h3>
						</div>
						${
							destination.address
								? `
							<div style="
								display: flex; 
								align-items: center; 
								gap: 8px; 
								margin-bottom: 8px; 
								padding: 8px; 
								background: rgba(255,255,255,0.7);
								border-radius: 8px;
							">
								<span style="color: #4a90e2; font-size: 14px;">🏠</span>
								<p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.4;">
									${destination.address}
								</p>
							</div>
						`
								: ""
						}
						${
							destination.rating
								? `
							<div style="
								display: flex; 
								align-items: center; 
								gap: 8px; 
								padding: 8px; 
								background: rgba(255,255,255,0.7);
								border-radius: 8px;
							">
								<span style="color: #fbbf24; font-size: 14px;">⭐</span>
								<p style="margin: 0; color: #475569; font-size: 13px; font-weight: 600;">
									${destination.rating} estrellas
								</p>
							</div>
						`
								: ""
						}
						<div style="
							margin-top: 12px; 
							padding: 8px; 
							background: linear-gradient(135deg, #4a90e2, #357abd);
							border-radius: 8px;
							text-align: center;
						">
							<p style="
								margin: 0; 
								color: white; 
								font-size: 12px; 
								font-weight: 600;
								text-shadow: 0 1px 2px rgba(0,0,0,0.2);
							">
								🗺️ Destino seleccionado en Turistea
							</p>
						</div>
					</div>
				`,
			});

			// Mostrar ventana al hacer clic en el marcador
			destinationMarkerRef.current.addListener("click", () => {
				infoWindow.open(googleMapRef.current, destinationMarkerRef.current);
			});

			// Centrar y hacer zoom al destino
			googleMapRef.current.setCenter(position);
			googleMapRef.current.setZoom(16);

			// Mostrar automáticamente la ventana de información
			setTimeout(() => {
				infoWindow.open(googleMapRef.current, destinationMarkerRef.current);
			}, 500);
		} else if (!destination && destinationMarkerRef.current) {
			// Limpiar marcador si no hay destino
			destinationMarkerRef.current.setMap(null);
			destinationMarkerRef.current = null;

			// Volver a la vista por defecto
			googleMapRef.current.setCenter(center);
			googleMapRef.current.setZoom(zoom);
		}
	}, [destination, center, zoom]);

	return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

const MapaInteractivo = () => {
	const [userLocation, setUserLocation] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { destination } = useContext(MapContext);

	// Coordenadas por defecto (Huánuco, Perú)
	const defaultCenter = LocationConfig.getDefaultLocation();

	// Función para obtener la ubicación del usuario
	const obtenerUbicacion = () => {
		setLoading(true);
		setError(null);

		if (!navigator.geolocation) {
			setError("La geolocalización no es compatible con este navegador");
			setLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;

				// Validar que la ubicación esté en el área de Huánuco
				const validLocation = LocationConfig.getValidLocationOrDefault(
					latitude,
					longitude
				);

				if (latitude !== validLocation.lat || longitude !== validLocation.lng) {
					console.log(
						"📍 [DEBUG] Ubicación fuera del área de Huánuco, usando ubicación por defecto"
					);
					setError(
						"Ubicación fuera del área de Huánuco. Usando ubicación del centro de la ciudad."
					);
				}

				setUserLocation(validLocation);
				console.log("📍 [DEBUG] Ubicación obtenida:", validLocation);
				setLoading(false);
			},
			(error) => {
				let errorMessage = "Error desconocido";
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage =
							"Acceso a la ubicación denegado. Usando ubicación del centro de Huánuco.";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage =
							"Ubicación no disponible. Usando ubicación del centro de Huánuco.";
						break;
					case error.TIMEOUT:
						errorMessage =
							"Tiempo de espera agotado. Usando ubicación del centro de Huánuco.";
						break;
				}

				// En caso de error, usar la ubicación por defecto
				const defaultLocation = LocationConfig.getDefaultLocation();
				setUserLocation(defaultLocation);
				setError(errorMessage);
				console.log(
					"📍 [DEBUG] Error en geolocalización, usando ubicación por defecto:",
					defaultLocation
				);
				setLoading(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 600000,
			}
		);
	};

	return (
		<div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden border border-colorp/20">
			{/* Header del mapa estilizado */}
			<div className="bg-coloro1 text-colorb px-4 py-3 shadow-md">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-white/20 p-2 rounded-full">
							<FontAwesomeIcon
								icon="map-marked-alt"
								className="text-white text-lg"
							/>
						</div>
						<div>
							<h3 className="font-bold text-lg">Mapa Interactivo</h3>
							<p className="text-white/80 text-sm">Explora Huánuco</p>
						</div>
					</div>
					<div className="bg-white/20 px-3 py-1 rounded-full">
						<FontAwesomeIcon
							icon="compass"
							className="text-white text-sm mr-2"
						/>
						<span className="text-sm font-medium">GPS</span>
					</div>
				</div>
			</div>

			{/* Panel de información del destino */}
			{destination && (
				<div className="bg-gradient-to-r from-coloro2 to-colorwc px-4 py-3 border-b border-colorp/10">
					<div className="flex items-center gap-3">
						<div className="bg-colorp p-2 rounded-full">
							<FontAwesomeIcon icon="map-pin" className="text-colorb text-sm" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<FontAwesomeIcon icon="eye" className="text-colorp text-sm" />
								<span className="text-colorb font-semibold text-sm">
									Mostrando:
								</span>
							</div>
							<p className="text-coloro1 font-bold">{destination.title}</p>
						</div>
						<div className="text-right">
							<div className="flex items-center gap-1 text-colorp text-xs">
								<FontAwesomeIcon icon="crosshairs" />
								<span>Centrado</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Controles estilizados */}
			<div className="bg-colorb px-4 py-3 border-b border-colorp/10">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-3">
						{!destination ? (
							<div className="flex items-center gap-2 text-coloro2">
								<FontAwesomeIcon icon="info-circle" className="text-colorp" />
								<span className="text-sm">
									Selecciona un lugar desde las tarjetas
								</span>
							</div>
						) : (
							<div className="flex items-center gap-2 text-coloro1">
								<FontAwesomeIcon
									icon="check-circle"
									className="text-green-500"
								/>
								<span className="text-sm font-medium">Destino cargado</span>
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						{/* Botón de ubicación mejorado */}
						<button
							onClick={obtenerUbicacion}
							disabled={loading}
							className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
								loading
									? "bg-gray-400 text-gray-200 cursor-not-allowed"
									: userLocation
									? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
									: "bg-gradient-to-r from-colorp to-colorc2 text-colorb hover:from-colorc2 hover:to-colorp"
							}`}>
							<FontAwesomeIcon
								icon={
									loading ? "spinner" : userLocation ? "check" : "crosshairs"
								}
								className={loading ? "animate-spin" : ""}
							/>
							{loading
								? "Ubicando..."
								: userLocation
								? "Ubicado"
								: "Mi Ubicación"}
						</button>

						{/* Botón de recenter si hay destino */}
						{destination && (
							<button
								className="flex items-center gap-2 px-3 py-2 bg-colorm text-colorp rounded-xl text-sm font-medium hover:bg-colorm/80 transition-all duration-300 shadow-md hover:shadow-lg"
								onClick={() => {
									// Funcionalidad para recentrar el mapa
									console.log("Recentrando mapa");
								}}>
								<FontAwesomeIcon icon="expand-arrows-alt" />
								<span>Centrar</span>
							</button>
						)}
					</div>
				</div>

				{/* Mensajes de estado estilizados */}
				{error && (
					<div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
						<FontAwesomeIcon icon="exclamation-triangle" />
						<span className="text-sm">{error}</span>
					</div>
				)}
				{userLocation && !error && (
					<div className="mt-3 flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
						<FontAwesomeIcon icon="check-circle" />
						<span className="text-sm font-medium">
							Ubicación encontrada exitosamente
						</span>
						<FontAwesomeIcon icon="map-marker-alt" className="text-green-500" />
					</div>
				)}
			</div>

			{/* Contenedor del mapa con overlay decorativo */}
			<div className="flex-1 relative bg-gray-100">
				{/* Overlay de carga con mejor diseño */}
				<div className="absolute inset-0 z-10 pointer-events-none">
					{/* Leyenda de controles */}
					<div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-colorp/20">
						<div className="text-xs text-coloro1">
							<div className="flex items-center gap-2 mb-1">
								<FontAwesomeIcon icon="mouse" className="text-colorp" />
								<span>Arrastra para mover</span>
							</div>
							<div className="flex items-center gap-2">
								<FontAwesomeIcon icon="expand" className="text-colorp" />
								<span>Scroll para zoom</span>
							</div>
						</div>
					</div>
				</div>

				<Wrapper
					apiKey={
						process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
						"TU_API_KEY_DE_GOOGLE_MAPS"
					}
					render={(status) => {
						switch (status) {
							case "LOADING":
								return (
									<div className="flex items-center justify-center h-full bg-gradient-to-br from-coloro2 to-colorwc">
										<div className="text-center p-8">
											<div className="mb-4">
												<FontAwesomeIcon
													icon="map"
													className="text-6xl text-colorp animate-pulse"
												/>
											</div>
											<div className="flex items-center justify-center gap-2 mb-2">
												<FontAwesomeIcon
													icon="spinner"
													className="text-colorp animate-spin"
												/>
												<span className="text-coloro1 font-medium">
													Cargando mapa...
												</span>
											</div>
											<p className="text-coloro2 text-sm">
												Preparando la vista satelital de Huánuco
											</p>
										</div>
									</div>
								);
							case "FAILURE":
								return (
									<div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100">
										<div className="text-center p-8">
											<div className="mb-4">
												<FontAwesomeIcon
													icon="exclamation-triangle"
													className="text-6xl text-red-500"
												/>
											</div>
											<h3 className="text-red-700 font-bold text-lg mb-2">
												Error al cargar Google Maps
											</h3>
											<p className="text-red-600 text-sm mb-3">
												No se pudo conectar con el servicio de mapas
											</p>
											<div className="bg-red-200 text-red-800 text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2">
												<FontAwesomeIcon icon="key" />
												<span>Verifica la configuración de la API key</span>
											</div>
										</div>
									</div>
								);
							case "SUCCESS":
								return (
									<div className="h-full relative">
										<MapComponent
											center={
												destination
													? { lat: destination.lat, lng: destination.lng }
													: defaultCenter
											}
											zoom={destination ? 16 : 12}
										/>
									</div>
								);
							default:
								return (
									<div className="flex items-center justify-center h-full bg-gradient-to-br from-colorm to-colorwc">
										<div className="text-center p-8">
											<div className="mb-4">
												<FontAwesomeIcon
													icon="clock"
													className="text-6xl text-colorp animate-pulse"
												/>
											</div>
											<div className="flex items-center justify-center gap-2 mb-2">
												<FontAwesomeIcon
													icon="cog"
													className="text-colorp animate-spin"
												/>
												<span className="text-coloro1 font-medium">
													Inicializando...
												</span>
											</div>
											<p className="text-coloro2 text-sm">
												Configurando el mapa interactivo
											</p>
										</div>
									</div>
								);
						}
					}}
				/>
			</div>

			{/* Footer con información adicional */}
			<div className="bg-gradient-to-r from-colorwc to-colorm px-4 py-2 border-t border-colorp/10">
				<div className="flex items-center justify-between text-xs">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1 text-coloro2">
							<FontAwesomeIcon icon="shield-alt" className="text-colorp" />
							<span>Datos protegidos</span>
						</div>
						<div className="flex items-center gap-1 text-coloro2">
							<FontAwesomeIcon icon="bolt" className="text-colorp" />
							<span>Tiempo real</span>
						</div>
					</div>
					<div className="flex items-center gap-1 text-coloro2">
						<FontAwesomeIcon icon="globe" className="text-colorp" />
						<span>Powered by Google Maps</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MapaInteractivo;
