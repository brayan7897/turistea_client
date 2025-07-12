import React, { useState, useEffect, useRef, useContext } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import MapContext from "../contex/mapContext";

// Componente interno del mapa - Simplificado
const MapComponent = ({ center, zoom }) => {
	const mapRef = useRef(null);
	const googleMapRef = useRef(null);
	const destinationMarkerRef = useRef(null);
	const { destination } = useContext(MapContext);

	useEffect(() => {
		// Crear el mapa
		if (mapRef.current && !googleMapRef.current) {
			googleMapRef.current = new window.google.maps.Map(mapRef.current, {
				center: center,
				zoom: zoom,
				mapTypeId: "roadmap",
				styles: [
					// Estilo personalizado más limpio
					{
						featureType: "poi",
						elementType: "labels",
						stylers: [{ visibility: "on" }],
					},
					{
						featureType: "landscape",
						elementType: "all",
						stylers: [{ color: "#f2f2f2" }],
					},
					{
						featureType: "road",
						elementType: "all",
						stylers: [{ saturation: -100 }, { lightness: 45 }],
					},
					{
						featureType: "water",
						elementType: "all",
						stylers: [{ color: "#46bcec" }, { visibility: "on" }],
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

			// Crear nuevo marcador en el destino
			const position = { lat: destination.lat, lng: destination.lng };

			destinationMarkerRef.current = new window.google.maps.Marker({
				position: position,
				map: googleMapRef.current,
				title: destination.title,
				icon: {
					url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
					scaledSize: new window.google.maps.Size(50, 50),
				},
				animation: window.google.maps.Animation.DROP,
			});

			// Crear ventana de información
			const infoWindow = new window.google.maps.InfoWindow({
				content: `
					<div style="padding: 10px; max-width: 250px;">
						<h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: bold;">
							${destination.title}
						</h3>
						${
							destination.address
								? `
							<p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">
								📍 ${destination.address}
							</p>
						`
								: ""
						}
						${
							destination.rating
								? `
							<p style="margin: 0; color: #666; font-size: 13px;">
								⭐ ${destination.rating} estrellas
							</p>
						`
								: ""
						}
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
	const defaultCenter = { lat: -9.9306, lng: -76.2422 };

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
				const newLocation = { lat: latitude, lng: longitude };
				setUserLocation(newLocation);
				setLoading(false);
			},
			(error) => {
				let errorMessage = "Error desconocido";
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage = "Acceso a la ubicación denegado";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage = "Ubicación no disponible";
						break;
					case error.TIMEOUT:
						errorMessage = "Tiempo de espera agotado";
						break;
				}
				setError(errorMessage);
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
		<div className="w-full h-full flex flex-col">
			{/* Controles simplificados */}
			<div className="bg-colorb p-3 border-b border-gray-200">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						{destination ? (
							<span className="text-sm font-medium text-gray-700">
								🎯 Mostrando: {destination.title}
							</span>
						) : (
							<span className="text-sm text-gray-500">
								Selecciona un lugar desde las tarjetas
							</span>
						)}
					</div>
					<button
						onClick={obtenerUbicacion}
						disabled={loading}
						className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
						<span>{loading ? "🔄" : "📍"}</span>
						{loading ? "Ubicando..." : "Mi Ubicación"}
					</button>
				</div>

				{/* Mensajes de estado */}
				{error && (
					<div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
						{error}
					</div>
				)}
				{userLocation && (
					<div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
						✅ Ubicación encontrada
					</div>
				)}
			</div>

			{/* Mapa */}
			<div className="flex-1">
				<Wrapper
					apiKey={
						process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
						"TU_API_KEY_DE_GOOGLE_MAPS"
					}
					render={(status) => {
						switch (status) {
							case "LOADING":
								return (
									<div className="flex items-center justify-center h-full text-gray-500">
										<div className="text-center">
											<div className="text-2xl mb-2">🗺️</div>
											<div>Cargando mapa...</div>
										</div>
									</div>
								);
							case "FAILURE":
								return (
									<div className="flex items-center justify-center h-full text-red-500">
										<div className="text-center">
											<div className="text-2xl mb-2">❌</div>
											<div>Error al cargar Google Maps</div>
											<div className="text-xs mt-1">Verifica la API key</div>
										</div>
									</div>
								);
							case "SUCCESS":
								return (
									<MapComponent
										center={
											destination
												? { lat: destination.lat, lng: destination.lng }
												: defaultCenter
										}
										zoom={destination ? 16 : 12}
									/>
								);
							default:
								return (
									<div className="flex items-center justify-center h-full text-gray-400">
										<div className="text-center">
											<div className="text-2xl mb-2">⏳</div>
											<div>Inicializando...</div>
										</div>
									</div>
								);
						}
					}}
				/>
			</div>
		</div>
	);
};

export default MapaInteractivo;
