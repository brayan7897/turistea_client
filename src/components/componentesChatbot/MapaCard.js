import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapaInteractivo from "../MapaInteractivo";
import MapContext from "../../contex/mapContext";

const MapaCard = () => {
	const { destination, clearDestination } = useContext(MapContext);

	return (
		<li className="flex justify-center p-4">
			<div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
				{/* Header del mapa */}
				<div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<FontAwesomeIcon icon="map" className="text-2xl" />
							<div>
								<h3 className="text-lg font-bold flex items-center gap-2">
									{destination ? (
										<>
											<FontAwesomeIcon icon="map-marker-alt" />{" "}
											{destination.title}
										</>
									) : (
										"Mapa Interactivo"
									)}
								</h3>
								{destination && (
									<p className="text-blue-100 text-sm">{destination.address}</p>
								)}
							</div>
						</div>
						{destination && (
							<button
								onClick={clearDestination}
								className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-1">
								<FontAwesomeIcon icon="times" /> Cerrar
							</button>
						)}
					</div>
				</div>

				{/* Contenedor del mapa - Más grande */}
				<div className="h-[500px] w-full">
					<MapaInteractivo />
				</div>

				{/* Footer con información */}
				{destination && (
					<div className="bg-gray-50 p-4 border-t border-gray-200">
						<div className="flex items-center justify-between text-sm text-gray-600">
							<div className="flex items-center gap-4">
								<span className="flex items-center gap-1">
									<FontAwesomeIcon icon="map-pin" className="text-green-600" />
									Ubicación seleccionada
								</span>
								{destination.rating && (
									<span className="flex items-center gap-1">
										<FontAwesomeIcon icon="star" className="text-yellow-500" />
										{destination.rating}
									</span>
								)}
							</div>
							<button
								onClick={() =>
									window.open(
										`https://www.google.com/maps?q=${destination.lat},${destination.lng}`,
										"_blank"
									)
								}
								className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors text-xs font-medium">
								Abrir en Google Maps
							</button>
						</div>
					</div>
				)}
			</div>
		</li>
	);
};

export default MapaCard;
