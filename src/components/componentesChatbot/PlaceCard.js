import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapContext from "../../contex/mapContext";

function PlaceCard(props) {
	const { card } = props;
	const [modal, switchModal] = useState(false);
	const { navigateToDestination } = useContext(MapContext);

	// Debug: verificar qué datos están llegando a PlaceCard
	console.log("🏛️ [DEBUG] PlaceCard recibió:", card);

	// Modificamos la clase del modal para un posicionamiento correcto
	const vModal = modal
		? "fixed inset-0 z-50 flex items-center justify-center"
		: "hidden";

	const toggleModal = () => {
		if (modal) {
			switchModal(false);
		} else {
			switchModal(true);
		}
	};

	// Verifica que card exista y tenga las propiedades necesarias
	if (!card || !card.title || !card.imageUrl) {
		return null;
	}

	// Obtener valores de manera segura
	const imageUrl = card.imageUrl?.stringValue || "";
	const title = card.title?.stringValue || "";
	const subtitle = card.subtitle?.stringValue || "";
	const buttonText = card.buttonUrl?.stringValue || "";

	// Debug específico para buttonText (ubicación)
	console.log("📍 [DEBUG] Ubicación en PlaceCard:", {
		buttonUrl: card.buttonUrl,
		buttonText: buttonText,
		fullCard: card,
	});

	// Debug específico para la descripción
	console.log("📝 [DEBUG] Descripción en PlaceCard:", {
		subtitle: card.subtitle,
		subtitleValue: subtitle,
		isEmpty: !subtitle || subtitle.trim() === "",
	});

	const activities = card.activities?.stringValue || "";
	const tips = card.tips?.stringValue || "";
	const rating = card.rating?.stringValue || "";
	const coordinates = card.coordinates?.stringValue || "";
	const type = card.type?.stringValue || "atraccion";
	const city = card.city?.stringValue || "";
	const phone = card.phone?.stringValue || "";
	const website = card.website?.stringValue || "";

	// Debug completo para todos los datos del card
	console.log("🔍 [DEBUG] Todos los datos extraídos del card:", {
		imageUrl: { raw: card.imageUrl, extracted: imageUrl },
		title: { raw: card.title, extracted: title },
		subtitle: { raw: card.subtitle, extracted: subtitle },
		buttonUrl: { raw: card.buttonUrl, extracted: buttonText },
		activities: { raw: card.activities, extracted: activities },
		tips: { raw: card.tips, extracted: tips },
		rating: { raw: card.rating, extracted: rating },
		coordinates: { raw: card.coordinates, extracted: coordinates },
		type: { raw: card.type, extracted: type },
		city: { raw: card.city, extracted: city },
		phone: { raw: card.phone, extracted: phone },
		website: { raw: card.website, extracted: website },
	});

	// Función para generar estrellas basadas en la calificación
	const renderStars = (rating) => {
		const numRating = parseFloat(rating);
		if (!numRating) return null;

		const fullStars = Math.floor(numRating);
		const hasHalfStar = numRating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

		return (
			<div className="flex items-center gap-1 mb-1">
				{[...Array(fullStars)].map((_, i) => (
					<span key={`full-${i}`} className="text-yellow-400 text-xs">
						★
					</span>
				))}
				{hasHalfStar && <span className="text-yellow-400 text-xs">☆</span>}
				{[...Array(emptyStars)].map((_, i) => (
					<span key={`empty-${i}`} className="text-gray-300 text-xs">
						☆
					</span>
				))}
				<span className="text-xs text-gray-600 ml-1">({numRating})</span>
			</div>
		);
	};

	// Función para obtener icono según el tipo usando Font Awesome
	const getTypeIcon = (type) => {
		const icons = {
			atraccion: "monument",
			hotel: "hotel",
			restaurante: "utensils",
			aventura: "mountain",
			natural: "tree",
			iglesia: "church",
			puente: "bridge",
			laguna: "water",
		};
		return icons[type] || "map-marker-alt";
	};

	// Función para renderizar el icono de Font Awesome
	const renderTypeIcon = (type) => {
		return <FontAwesomeIcon icon={getTypeIcon(type)} />;
	};

	// Función para manejar la navegación al destino - Simplificado
	const handleNavigateToDestination = (e) => {
		e.stopPropagation(); // Evitar que se cierre el modal

		if (!coordinates) {
			console.error("Coordenadas no disponibles para este lugar");
			return;
		}

		// Parsear coordenadas del formato "lat,lng"
		const [lat, lng] = coordinates
			.split(",")
			.map((coord) => parseFloat(coord.trim()));

		if (isNaN(lat) || isNaN(lng)) {
			console.error("Coordenadas inválidas:", coordinates);
			return;
		}

		const destinationData = {
			title: title,
			lat: lat,
			lng: lng,
			address: buttonText,
			type: type,
			rating: rating,
			description: subtitle,
		};

		// Enviar destino al contexto del mapa
		navigateToDestination(destinationData);

		// Cerrar el modal
		toggleModal();
	};

	return (
		<div className="relative flex-shrink-0">
			<div
				className="card-container w-[280px] h-[20rem] bg-white cursor-pointer rounded-2xl flex flex-col border-coloro1 border-solid border shadow-md card-hover"
				onClick={toggleModal}>
				<div className="w-full h-[11rem] relative">
					<img
						src={imageUrl}
						alt="imagen no disponible"
						className="w-full h-full rounded-t-2xl object-cover"></img>
					{/* Badge del tipo de lugar */}
					<div className="absolute top-2 right-2 bg-white bg-opacity-95 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm gradient-type text-white">
						<span>{renderTypeIcon(type)}</span>
						<span className="capitalize">{type}</span>
					</div>
					{/* Badge de calificación si existe */}
					{rating && (
						<div className="absolute top-2 left-2 gradient-rating text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
							<FontAwesomeIcon icon="star" /> {rating}
						</div>
					)}
				</div>
				<div className="flex flex-col justify-between text-coloro1 flex-1 p-4">
					<div className="space-y-2">
						<div>
							<p className="text-left font-bold text-sm line-clamp-2 mb-1 leading-tight">
								{title || "Lugar sin nombre"}
							</p>
							{rating && renderStars(rating)}
						</div>
						<p className="text-left font-normal text-xs text-gray-600 line-clamp-2 leading-relaxed">
							<FontAwesomeIcon icon="map-marker-alt" className="mr-1" />{" "}
							{buttonText || "Dirección no disponible"}
						</p>
						{city && (
							<p className="text-left font-normal text-xs text-blue-600">
								<FontAwesomeIcon icon="building" className="mr-1" /> {city}
							</p>
						)}
					</div>
					<div className="mt-3 pt-2 border-t border-gray-100">
						<p className="text-xs text-blue-600 font-medium text-center flex items-center justify-center gap-1">
							<FontAwesomeIcon icon="hand-pointer" /> Toca para más detalles
						</p>
					</div>
				</div>
			</div>

			{/* Modal con información completa */}
			<div className={`${vModal}`}>
				{/* Overlay de fondo */}
				<div
					className="absolute inset-0 bg-black bg-opacity-100 backdrop-blur-sm"
					onClick={toggleModal}></div>

				{/* Contenido del modal */}
				<div className="relative bg-colorb rounded-2xl shadow-2xl max-w-[650px] max-h-[90vh] w-[95vw] mx-4 flex flex-col overflow-hidden modal-animate">
					{/* Header del modal */}
					<div className="flex justify-between items-start p-6 pb-4 border-b border-gray-200">
						<div className="flex items-start gap-3 flex-1 mr-4">
							<span className="text-3xl flex-shrink-0">
								{renderTypeIcon(type)}
							</span>
							<div className="flex-1 min-w-0">
								<h2 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
									{title}
								</h2>
								{rating && (
									<div className="flex items-center gap-1 mt-2">
										{renderStars(rating)}
									</div>
								)}
								{city && (
									<div className="mt-2">
										<span className="inline-flex items-center gap-1 text-xs info-badge text-blue-800 px-2 py-1 rounded-full">
											<FontAwesomeIcon icon="building" /> {city}
										</span>
									</div>
								)}
							</div>
						</div>
						<button
							onClick={toggleModal}
							className="text-gray-400 hover:text-gray-600 text-3xl font-bold p-1 flex-shrink-0 hover:bg-gray-100 rounded-full transition-colors">
							×
						</button>
					</div>

					{/* Contenido scrolleable */}
					<div className="flex-1 overflow-y-auto px-6 space-y-5 custom-scrollbar">
						{/* Imagen principal */}
						<div className="w-full h-52 rounded-xl overflow-hidden shadow-md">
							<img
								src={imageUrl}
								alt={title}
								className="w-full h-full object-cover"></img>
						</div>

						{/* Descripción */}
						<div className="bg-gray-50 p-4 rounded-xl">
							<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<FontAwesomeIcon icon="info-circle" /> Descripción
							</h3>
							<p className="text-gray-700 text-sm leading-relaxed">
								{subtitle ||
									"Información de descripción no disponible para este lugar."}
							</p>
						</div>

						{/* Ubicación */}
						<div className="bg-blue-50 p-4 rounded-xl">
							<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<FontAwesomeIcon icon="map-marker-alt" /> Ubicación
							</h3>
							<div className="space-y-3">
								<p className="text-gray-700 text-sm font-medium">
									{buttonText || "Dirección no disponible"}
								</p>
								{coordinates ? (
									<div className="bg-white p-3 rounded-lg border border-blue-200">
										<p className="text-xs text-gray-600 mb-2 font-medium flex items-center gap-1">
											<FontAwesomeIcon icon="map-marked-alt" /> Coordenadas GPS:
										</p>
										<p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
											{coordinates}
										</p>
										<div className="mt-3 grid grid-cols-1 gap-2">
											<button
												onClick={() =>
													window.open(
														`https://www.google.com/maps?q=${coordinates}`,
														"_blank"
													)
												}
												className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium shadow-sm">
												<FontAwesomeIcon icon="map" className="mr-2" /> Abrir en
												Google Maps
											</button>
											<button
												onClick={handleNavigateToDestination}
												className="w-full bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium shadow-sm">
												<FontAwesomeIcon icon="compass" className="mr-2" /> Ver
												Ruta en Mapa Interactivo
											</button>
										</div>
									</div>
								) : (
									<div className="bg-white p-3 rounded-lg border border-gray-200">
										<p className="text-sm text-gray-500 italic">
											Coordenadas GPS no disponibles para este lugar.
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Actividades */}
						<div className="bg-green-50 p-4 rounded-xl">
							<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<FontAwesomeIcon icon="hiking" /> Actividades
							</h3>
							<div className="bg-white p-3 rounded-lg border border-green-200">
								<p className="text-gray-700 text-sm leading-relaxed">
									{activities && activities !== "Información no disponible"
										? activities
										: "Información de actividades no disponible para este lugar."}
								</p>
							</div>
						</div>

						{/* Consejos */}
						<div className="bg-yellow-50 p-4 rounded-xl">
							<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<FontAwesomeIcon icon="lightbulb" /> Consejos útiles
							</h3>
							<div className="bg-white p-3 rounded-lg border-l-4 border-yellow-400 border border-yellow-200">
								<p className="text-gray-700 text-sm leading-relaxed">
									{tips && tips !== "Información no disponible"
										? tips
										: "Información de consejos no disponible para este lugar."}
								</p>
							</div>
						</div>

						{/* Información de contacto */}
						{(phone || website) && (
							<div className="contact-badge p-4 rounded-xl">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<FontAwesomeIcon icon="phone" /> Información de contacto
								</h3>
								<div className="space-y-3">
									{phone && (
										<div className="bg-white p-3 rounded-lg border border-purple-200 flex items-center gap-3 hover:shadow-md transition-shadow">
											<span className="text-blue-600 text-lg">
												<FontAwesomeIcon icon="phone" />
											</span>
											<div className="flex-1">
												<p className="text-xs text-gray-600 mb-1">Teléfono</p>
												<a
													href={`tel:${phone}`}
													className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors">
													{phone}
												</a>
											</div>
										</div>
									)}
									{website && (
										<div className="bg-white p-3 rounded-lg border border-purple-200 flex items-center gap-3 hover:shadow-md transition-shadow">
											<span className="text-green-600 text-lg">
												<FontAwesomeIcon icon="globe" />
											</span>
											<div className="flex-1">
												<p className="text-xs text-gray-600 mb-1">Sitio web</p>
												<a
													href={website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-green-600 hover:text-green-800 text-sm font-medium underline transition-colors">
													Visitar sitio oficial
												</a>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Footer del modal */}
					<div className="px-6 pt-4 pb-6 border-t border-gray-200">
						<button
							className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
							onClick={toggleModal}>
							Cerrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PlaceCard;
