/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import imglm from "../assets/img/imginfo1.svg";
import imgrd from "../assets/img/imginfo2.svg";

const Info = () => {
	return (
		<div className="bg-coloro1 w-[23.52%] ml-[7.77%] pt-[5%] max-[1450px]:w-[30%] max-[1200px]:w-[35%] max-[900px]:mb-[1rem] max-[500px]:ml-0 max-[500px]:pt-0 max-[500px]:w-full max-[500px]:text-center shadow-lg rounded-r-2xl">
			{/* Header mejorado con icono */}
			<div className="flex items-center gap-3 absolute top-6 left-[7.77%] max-[500px]:static max-[500px]:justify-center max-[500px]:mb-6">
				<FontAwesomeIcon
					icon="map-marked-alt"
					className="text-colorp text-[2.5rem] max-[1450px]:text-[2rem] max-[500px]:text-[2rem] drop-shadow-md"
				/>
				<span className="text-colorp text-[3.153vw] font-bold max-[1450px]:text-[3.125rem] max-[900px]:text-[2.5rem] max-[500px]:text-[2rem] drop-shadow-sm">
					Turistea
				</span>
			</div>

			<div className="flex flex-col gap-6 max-[1000px]:hidden max-[500px]:flex max-[500px]:px-4 max-[500px]:pb-4">
				{/* Línea divisoria mejorada */}
				<div className="bg-gradient-to-r from-transparent via-colorp to-transparent h-[3px] rounded-full shadow-sm"></div>


				{/* Grid principal de características con animaciones mejoradas */}
				<div className="grid grid-cols-1 gap-4">
					{/* Tarjeta de información detallada */}
					<div className="bg-gradient-to-br from-coloro2 to-colorwc rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:rotate-[0.5deg] p-5 border border-colorp/20 group">
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 bg-coloro1 p-3 rounded-full shadow-md border-2 border-colorp group-hover:border-colorc2 transition-colors">
								<img
									src={imglm}
									alt="información detallada"
									className="w-[2rem] h-[2rem] group-hover:scale-110 transition-transform"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-2">
									<FontAwesomeIcon
										icon="info-circle"
										className="text-colorp text-base group-hover:animate-pulse"
									/>
									<h3 className="text-colorb font-bold text-base group-hover:text-coloro1 transition-colors">
										Información Detallada
									</h3>
								</div>
								<p className="text-colorc1 text-sm leading-relaxed mb-3">
									Lugares verificados con descripciones completas, actividades
									recomendadas y consejos útiles.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="inline-flex items-center gap-1 text-xs text-colorp font-medium bg-coloro1/20 px-2 py-1 rounded-full hover:bg-colorp/20 transition-colors">
										<FontAwesomeIcon icon="check" />
										Verificado
									</span>
									<span className="inline-flex items-center gap-1 text-xs text-colorc2 font-medium bg-coloro1/20 px-2 py-1 rounded-full hover:bg-colorc2/20 transition-colors">
										<FontAwesomeIcon icon="star" />
										Calificado
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Tarjeta de rutas */}
					<div className="bg-gradient-to-br from-coloro2 to-colorwc rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:rotate-[-0.5deg] p-5 border border-colorp/20 group">
						<div className="flex items-start gap-4">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-2">
									<FontAwesomeIcon
										icon="route"
										className="text-colorp text-base group-hover:animate-pulse"
									/>
									<h3 className="text-colorb font-bold text-base group-hover:text-coloro1 transition-colors">
										Rutas Inteligentes
									</h3>
								</div>
								<p className="text-colorc1 text-sm leading-relaxed mb-3">
									Navegación GPS optimizada con mapas interactivos y cálculo de
									rutas en tiempo real.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="inline-flex items-center gap-1 text-xs text-colorp font-medium bg-coloro1/20 px-2 py-1 rounded-full hover:bg-colorp/20 transition-colors">
										<FontAwesomeIcon icon="compass" />
										GPS
									</span>
									<span className="inline-flex items-center gap-1 text-xs text-colorc2 font-medium bg-coloro1/20 px-2 py-1 rounded-full hover:bg-colorc2/20 transition-colors">
										<FontAwesomeIcon icon="clock" />
										Tiempo real
									</span>
								</div>
							</div>
							<div className="flex-shrink-0 bg-coloro1 p-3 rounded-full shadow-md border-2 border-colorp group-hover:border-colorc2 transition-colors">
								<img
									src={imgrd}
									alt="rutas inteligentes"
									className="w-[2rem] h-[2rem] group-hover:scale-110 transition-transform"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Sección de características destacadas */}
				

				{/* Grid de servicios adicionales */}
				<div className="grid grid-cols-2 gap-3 max-[500px]:gap-2">
					<div className="bg-coloro1 rounded-xl shadow-md p-4 max-[500px]:p-3 border border-colorwc hover:shadow-lg hover:border-colorp transition-all duration-300 group">
						<div className="text-center">
							<FontAwesomeIcon
								icon="hotel"
								className="text-colorp text-xl max-[500px]:text-lg mb-2 group-hover:scale-110 transition-transform"
							/>
							<h4 className="text-coloro1 font-semibold text-sm max-[500px]:text-xs mb-1">
								Hoteles
							</h4>
							<p className="text-coloro2 text-xs max-[500px]:text-[10px] leading-tight">
								Alojamiento verificado y seguro
							</p>
						</div>
					</div>

					<div className="bg-coloro1 rounded-xl shadow-md p-4 max-[500px]:p-3 border border-colorwc hover:shadow-lg hover:border-colorp transition-all duration-300 group">
						<div className="text-center">
							<FontAwesomeIcon
								icon="utensils"
								className="text-colorp text-xl max-[500px]:text-lg mb-2 group-hover:scale-110 transition-transform"
							/>
							<h4 className="text-coloro1 font-semibold text-sm max-[500px]:text-xs mb-1">
								Restaurantes
							</h4>
							<p className="text-coloro2 text-xs max-[500px]:text-[10px] leading-tight">
								Gastronomía local auténtica
							</p>
						</div>
					</div>
				</div>

				{/* Estadísticas mejoradas con efectos hover */}
				<div className="bg-gradient-to-r from-colorwc to-colorm rounded-xl p-4 max-[500px]:p-3 border border-colorp/30 shadow-inner hover:shadow-lg transition-shadow">
					<div className="text-center mb-3">
						<h4 className="text-coloro1 font-bold text-sm max-[500px]:text-xs flex items-center justify-center gap-2">
							<FontAwesomeIcon
								icon="database"
								className="text-colorp animate-pulse"
							/>
							Nuestra Base de Datos
						</h4>
					</div>
					<div className="grid grid-cols-3 gap-1">
						<div className="text-center p-2 max-[500px]:p-1 hover:bg-coloro1/20 rounded-lg transition-colors group cursor-pointer">
							<FontAwesomeIcon
								icon="map-marker-alt"
								className="text-colorp text-lg max-[500px]:text-base mb-1 group-hover:animate-bounce"
							/>
							<div className="text-coloro1 font-bold text-base max-[500px]:text-sm group-hover:text-colorp transition-colors">
								15+
							</div>
							<div className="text-coloro2 text-xs max-[500px]:text-[10px]">
								Lugares
							</div>
						</div>
						<div className="text-center p-2 max-[500px]:p-1 hover:bg-coloro1/20 rounded-lg transition-colors group cursor-pointer">
							<FontAwesomeIcon
								icon="hotel"
								className="text-colorp text-lg max-[500px]:text-base mb-1 group-hover:animate-bounce"
							/>
							<div className="text-coloro1 font-bold text-base max-[500px]:text-sm group-hover:text-colorp transition-colors">
								8+
							</div>
							<div className="text-coloro2 text-xs max-[500px]:text-[10px]">
								Hoteles
							</div>
						</div>
						<div className="text-center p-2 max-[500px]:p-1 hover:bg-coloro1/20 rounded-lg transition-colors group cursor-pointer">
							<FontAwesomeIcon
								icon="utensils"
								className="text-colorp text-lg max-[500px]:text-base mb-1 group-hover:animate-bounce"
							/>
							<div className="text-coloro1 font-bold text-base max-[500px]:text-sm group-hover:text-colorp transition-colors">
								12+
							</div>
							<div className="text-coloro2 text-xs max-[500px]:text-[10px]">
								Restaurantes
							</div>
						</div>
					</div>
				</div>

				{/* Llamada a la acción mejorada con gradiente animado */}
				<div className="relative overflow-hidden bg-gradient-to-r from-colorp to-colorc2 rounded-xl p-4 max-[500px]:p-3 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
					{/* Efecto de brillo animado */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

					<div className="relative z-10">
						<div className="flex items-center justify-center gap-2 mb-2">
							<FontAwesomeIcon
								icon="hand-pointer"
								className="text-colorb text-base max-[500px]:text-sm animate-bounce group-hover:scale-110 transition-transform"
							/>
							<h4 className="text-colorb font-bold text-base max-[500px]:text-sm group-hover:scale-105 transition-transform">
								¡Comienza tu aventura!
							</h4>
						</div>
						<p className="text-colorb text-sm max-[500px]:text-xs opacity-95 leading-tight">
							Explora Huánuco con nuestro asistente inteligente
						</p>
						<div className="flex items-center justify-center gap-1 mt-2">
							<FontAwesomeIcon
								icon="arrow-right"
								className="text-colorb text-xs animate-pulse"
							/>
							<span className="text-colorb text-xs font-medium">
								Pregúntame algo
							</span>
							<FontAwesomeIcon
								icon="arrow-left"
								className="text-colorb text-xs animate-pulse"
							/>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
};

export default Info;
