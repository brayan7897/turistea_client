import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapContext from "../../contex/mapContext";

function RestaurantCard({ restaurant }) {
	const [modal, switchModal] = useState(false);
	const { navigateToDestination } = useContext(MapContext);

	const vModal = modal
		? "fixed inset-0 z-50 flex items-center justify-center"
		: "hidden";

	const toggleModal = () => switchModal(!modal);

	// Debug: verificar datos del restaurante
	console.log("🍽️ [DEBUG] RestaurantCard recibió restaurant:", restaurant);
	console.log("🍝 [DEBUG] Especialidades del restaurante:", {
		especialidades: restaurant.especialidades,
		length: restaurant.especialidades ? restaurant.especialidades.length : 0,
		type: typeof restaurant.especialidades,
	});

	if (!restaurant || !restaurant.nombre) {
		console.log("❌ [DEBUG] RestaurantCard: restaurant inválido o sin nombre");
		return null;
	}

	// Extraer datos del restaurante
	const {
		nombre = "",
		descripcion = "",
		direccion = "",
		ciudad = "",
		coordenadas = "",
		calificacion = 0,
		telefono = "",
		url = "",
		imagen = "",
		actividades = "",
		consejos = "",
		precio_rango = "",
		especialidad = "",
		especialidades = [],
		horario = "",
		capacidad = "",
		ambiente = "",
		destacado = false,
	} = restaurant;

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

	// Función para obtener el color del precio
	const getPriceColor = (price) => {
		const colors = {
			$: "text-green-600",
			$$: "text-yellow-600",
			$$$: "text-orange-600",
			$$$$: "text-red-600",
		};
		return colors[price] || "text-gray-600";
	};

	// Función para obtener icono de especialidad
	const getSpecialtyIcon = (specialty) => {
		const icons = {
			"comida peruana": "flag",
			"comida criolla": "utensils",
			"comida regional": "mountain",
			"comida típica": "pepper-hot",
			mariscos: "fish",
			carnes: "drumstick-bite",
			vegetariano: "leaf",
			internacional: "globe",
			pizzería: "pizza-slice",
			parrilla: "fire",
		};

		const specialtyLower = specialty?.toLowerCase() || "";
		for (const [key, icon] of Object.entries(icons)) {
			if (specialtyLower.includes(key)) {
				return icon;
			}
		}
		return "utensils";
	};

	// Función para obtener color de ambiente
	const getAmbientColor = (ambient) => {
		const colors = {
			familiar: "text-green-600",
			romántico: "text-pink-600",
			casual: "text-blue-600",
			elegante: "text-purple-600",
			tradicional: "text-orange-600",
		};
		const ambientLower = ambient?.toLowerCase() || "";
		for (const [key, color] of Object.entries(colors)) {
			if (ambientLower.includes(key)) {
				return color;
			}
		}
		return "text-gray-600";
	};

	// Función para manejar la navegación
	const handleNavigateToDestination = (e) => {
		e.stopPropagation();

		if (!coordenadas) {
			console.error("Coordenadas no disponibles para este restaurante");
			return;
		}

		const [lat, lng] = coordenadas
			.split(",")
			.map((coord) => parseFloat(coord.trim()));

		if (isNaN(lat) || isNaN(lng)) {
			console.error("Coordenadas inválidas:", coordenadas);
			return;
		}

		const destinationData = {
			title: nombre,
			lat: lat,
			lng: lng,
			address: direccion,
			type: "restaurante",
			rating: calificacion,
			description: descripcion,
		};

		navigateToDestination(destinationData);
		toggleModal();
	};

	return (
		<div className="relative flex-shrink-0">
			<div
				className="card-container w-[280px] h-[22rem] bg-white cursor-pointer rounded-2xl flex flex-col border-orange-200 border-solid border shadow-md card-hover"
				onClick={toggleModal}>
				<div className="w-full h-[11rem] relative">
					<img
						src={imagen || "/api/placeholder/280/176"}
						alt={nombre}
						className="w-full h-full rounded-t-2xl object-cover"
						onError={(e) => {
							e.target.src = "/api/placeholder/280/176";
						}}
					/>

					{/* Badge de restaurante */}
					<div className="absolute top-2 right-2 bg-orange-600 bg-opacity-95 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm text-white">
						<FontAwesomeIcon icon="utensils" />
						<span>Restaurante</span>
					</div>

					{/* Badge de calificación */}
					{calificacion > 0 && (
						<div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
							<FontAwesomeIcon icon="star" /> {calificacion}
						</div>
					)}

					{/* Badge de destacado */}
					{destacado && (
						<div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
							<FontAwesomeIcon icon="heart" /> Destacado
						</div>
					)}
				</div>

				<div className="flex flex-col justify-between text-gray-800 flex-1 p-4">
					<div className="space-y-2">
						{/* Título y estrellas */}
						<div>
							<p className="text-left font-bold text-sm line-clamp-2 mb-1 leading-tight">
								{nombre}
							</p>
							{calificacion > 0 && renderStars(calificacion)}
						</div>

						{/* Especialidad */}
						{especialidad && (
							<div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full w-fit">
								<FontAwesomeIcon icon={getSpecialtyIcon(especialidad)} />
								<span className="line-clamp-1">{especialidad}</span>
							</div>
						)}

						{/* Dirección */}
						<p className="text-left font-normal text-xs text-gray-600 line-clamp-2 leading-relaxed">
							<FontAwesomeIcon
								icon="map-marker-alt"
								className="mr-1 text-orange-600"
							/>
							{direccion}
						</p>

						{/* Ciudad y precio */}
						<div className="flex items-center justify-between">
							{ciudad && (
								<p className="text-left font-normal text-xs text-orange-600">
									<FontAwesomeIcon icon="building" className="mr-1" /> {ciudad}
								</p>
							)}
							{precio_rango && (
								<span
									className={`text-xs font-bold ${getPriceColor(
										precio_rango
									)}`}>
									{precio_rango}
								</span>
							)}
						</div>

						{/* Ambiente */}
						{ambiente && (
							<div className="flex items-center gap-1 text-xs">
								<FontAwesomeIcon icon="heart" className="text-pink-500" />
								<span className={`${getAmbientColor(ambiente)} capitalize`}>
									{ambiente}
								</span>
							</div>
						)}
					</div>

					<div className="mt-3 pt-2 border-t border-gray-100">
						<p className="text-xs text-orange-600 font-medium text-center flex items-center justify-center gap-1">
							<FontAwesomeIcon icon="hand-pointer" /> Toca para más detalles
						</p>
					</div>
				</div>
			</div>

			{/* Modal del restaurante */}
			<div className={`${vModal}`}>
				<div
					className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
					onClick={toggleModal}></div>

				<div className="relative bg-white rounded-2xl shadow-2xl max-w-[650px] max-h-[90vh] w-[95vw] mx-4 flex flex-col overflow-hidden modal-animate">
					{/* Header */}
					<div className="flex justify-between items-start p-6 pb-4 border-b border-gray-200">
						<div className="flex items-start gap-3 flex-1 mr-4">
							<span className="text-3xl text-orange-600 flex-shrink-0">
								<FontAwesomeIcon icon="utensils" />
							</span>
							<div className="flex-1 min-w-0">
								<h2 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
									{nombre}
								</h2>
								{calificacion > 0 && (
									<div className="flex items-center gap-2 mt-2">
										{renderStars(calificacion)}
										{precio_rango && (
											<span
												className={`text-sm font-bold ${getPriceColor(
													precio_rango
												)}`}>
												{precio_rango}
											</span>
										)}
									</div>
								)}
								{(especialidad || destacado) && (
									<div className="mt-2 flex gap-2 flex-wrap">
										{especialidad && (
											<span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
												<FontAwesomeIcon
													icon={getSpecialtyIcon(especialidad)}
												/>
												{especialidad}
											</span>
										)}
										{destacado && (
											<span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
												<FontAwesomeIcon icon="heart" /> Destacado
											</span>
										)}
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
								src={imagen || "/api/placeholder/650/208"}
								alt={nombre}
								className="w-full h-full object-cover"
								onError={(e) => {
									e.target.src = "/api/placeholder/650/208";
								}}
							/>
						</div>

						{/* Descripción */}
						<div className="bg-orange-50 p-4 rounded-xl">
							<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<FontAwesomeIcon icon="info-circle" /> Acerca del Restaurante
							</h3>
							<p className="text-gray-700 text-sm leading-relaxed">
								{descripcion}
							</p>
						</div>

						{/* Especialidades del restaurante */}
						{especialidades && especialidades.length > 0 && (
							<div className="bg-red-50 p-4 rounded-xl">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<FontAwesomeIcon icon="star" /> Especialidades de la Casa
								</h3>
								<div className="grid grid-cols-1 gap-2">
									{especialidades.map((especialidad, index) => (
										<div
											key={index}
											className="bg-white p-3 rounded-lg border border-red-200 flex items-center gap-3 hover:shadow-md transition-shadow">
											<span className="text-red-600 text-lg">
												<FontAwesomeIcon icon="medal" />
											</span>
											<div className="flex-1">
												<p className="text-sm font-medium text-gray-800 capitalize">
													{especialidad}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Información gastronómica */}
						<div className="bg-green-50 p-4 rounded-xl">
							<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<FontAwesomeIcon icon="utensils" /> Información Gastronómica
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{especialidad && (
									<div className="bg-white p-3 rounded-lg border border-green-200">
										<p className="text-xs text-gray-600 mb-1 font-medium">
											Especialidad
										</p>
										<div className="flex items-center gap-2">
											<FontAwesomeIcon
												icon={getSpecialtyIcon(especialidad)}
												className="text-orange-600"
											/>
											<span className="text-sm font-medium text-gray-800">
												{especialidad}
											</span>
										</div>
									</div>
								)}
								{ambiente && (
									<div className="bg-white p-3 rounded-lg border border-green-200">
										<p className="text-xs text-gray-600 mb-1 font-medium">
											Ambiente
										</p>
										<div className="flex items-center gap-2">
											<FontAwesomeIcon icon="heart" className="text-pink-500" />
											<span
												className={`text-sm font-medium capitalize ${getAmbientColor(
													ambiente
												)}`}>
												{ambiente}
											</span>
										</div>
									</div>
								)}
								{capacidad && (
									<div className="bg-white p-3 rounded-lg border border-green-200">
										<p className="text-xs text-gray-600 mb-1 font-medium">
											Capacidad
										</p>
										<div className="flex items-center gap-2">
											<FontAwesomeIcon icon="users" className="text-blue-600" />
											<span className="text-sm font-medium text-gray-800">
												{capacidad}
											</span>
										</div>
									</div>
								)}
								{horario && (
									<div className="bg-white p-3 rounded-lg border border-green-200">
										<p className="text-xs text-gray-600 mb-1 font-medium">
											Horario
										</p>
										<div className="flex items-center gap-2">
											<FontAwesomeIcon icon="clock" className="text-blue-600" />
											<span className="text-sm font-medium text-gray-800">
												{horario}
											</span>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Ubicación */}
						<div className="bg-blue-50 p-4 rounded-xl">
							<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<FontAwesomeIcon icon="map-marker-alt" /> Ubicación
							</h3>
							<div className="space-y-3">
								<p className="text-gray-700 text-sm font-medium">{direccion}</p>
								{ciudad && (
									<p className="text-gray-600 text-sm">
										<FontAwesomeIcon icon="building" className="mr-1" />{" "}
										{ciudad}
									</p>
								)}
								{coordenadas && (
									<div className="bg-white p-3 rounded-lg border border-blue-200">
										<p className="text-xs text-gray-600 mb-2 font-medium flex items-center gap-1">
											<FontAwesomeIcon icon="map-marked-alt" /> Coordenadas GPS:
										</p>
										<p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
											{coordenadas}
										</p>
										<div className="mt-3 grid grid-cols-1 gap-2">
											<button
												onClick={() =>
													window.open(
														`https://www.google.com/maps?q=${coordenadas}`,
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
								)}
							</div>
						</div>

						{/* Menú/Platos */}
						{actividades && actividades !== "Información no disponible" && (
							<div className="bg-purple-50 p-4 rounded-xl">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<FontAwesomeIcon icon="list-ul" /> Menú y Platos
								</h3>
								<div className="bg-white p-3 rounded-lg border border-purple-200">
									<p className="text-gray-700 text-sm leading-relaxed">
										{actividades}
									</p>
								</div>
							</div>
						)}

						{/* Consejos */}
						{consejos && consejos !== "Información no disponible" && (
							<div className="bg-yellow-50 p-4 rounded-xl">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<FontAwesomeIcon icon="lightbulb" /> Consejos útiles
								</h3>
								<div className="bg-white p-3 rounded-lg border-l-4 border-yellow-400 border border-yellow-200">
									<p className="text-gray-700 text-sm leading-relaxed">
										{consejos}
									</p>
								</div>
							</div>
						)}

						{/* Información de contacto */}
						{(telefono || url) && (
							<div className="bg-gray-50 p-4 rounded-xl">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<FontAwesomeIcon icon="phone" /> Información de contacto
								</h3>
								<div className="space-y-3">
									{telefono && (
										<div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 hover:shadow-md transition-shadow">
											<span className="text-blue-600 text-lg">
												<FontAwesomeIcon icon="phone" />
											</span>
											<div className="flex-1">
												<p className="text-xs text-gray-600 mb-1">Teléfono</p>
												<a
													href={`tel:${telefono}`}
													className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors">
													{telefono}
												</a>
											</div>
										</div>
									)}
									{url && (
										<div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 hover:shadow-md transition-shadow">
											<span className="text-green-600 text-lg">
												<FontAwesomeIcon icon="globe" />
											</span>
											<div className="flex-1">
												<p className="text-xs text-gray-600 mb-1">Sitio web</p>
												<a
													href={url}
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

					{/* Footer */}
					<div className="px-6 pt-4 pb-6 border-t border-gray-200">
						<button
							className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
							onClick={toggleModal}>
							Cerrar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RestaurantCard;
