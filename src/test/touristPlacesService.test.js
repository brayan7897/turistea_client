// Archivo de prueba para verificar que el TouristPlacesService funciona con el JSON
import touristPlacesService from "../services/touristPlacesService.js";

// Función de prueba simple
function testTouristPlacesService() {
	console.log("=== Probando TouristPlacesService ===");

	// Probar extracción de lugares con keyword específico
	console.log('\n1. Probando extracción con "kotosh":');
	const kotoshPlaces = touristPlacesService.extractTouristPlaces(
		"Cuéntame sobre Kotosh"
	);
	console.log(kotoshPlaces);

	// Probar con keywords generales
	console.log("\n2. Probando con keywords generales:");
	const generalPlaces = touristPlacesService.extractTouristPlaces(
		"¿Qué lugares turísticos hay en Huánuco?"
	);
	console.log(generalPlaces);

	// Probar detección de cards
	console.log("\n3. Probando detección de cards:");
	console.log(
		'¿Debería mostrar cards para "lugares turísticos"?',
		touristPlacesService.shouldShowCards(
			"¿Qué lugares turísticos puedo visitar?"
		)
	);
	console.log(
		'¿Debería mostrar cards para "kotosh"?',
		touristPlacesService.shouldShowCards("Cuéntame sobre kotosh")
	);

	// Probar búsqueda por keyword
	console.log('\n4. Probando búsqueda por keyword "tingo":');
	const tingoPlaces = touristPlacesService.searchPlacesByKeyword("tingo");
	console.log(tingoPlaces);

	// Probar obtener todos los lugares
	console.log(
		"\n5. Total de places en database:",
		touristPlacesService.getAllPlaces().length
	);
	console.log(
		"Total de places desde JSON:",
		touristPlacesService.getAllPlacesFromJson().length
	);

	console.log("\n=== Pruebas completadas ===");
}

// Exportar para uso en console o pruebas
export { testTouristPlacesService };

// Si este archivo se ejecuta directamente, correr las pruebas
if (typeof window !== "undefined") {
	// En navegador, hacer disponible globalmente para pruebas
	window.testTouristPlacesService = testTouristPlacesService;
}
