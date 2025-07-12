// Test simple para verificar el sistema de cards dinámicos
import touristPlacesService from "./src/services/touristPlacesService.js";
import imageSearchService from "./src/services/imageSearchService.js";

// Test 1: Extraer lugares de una respuesta simulada de OpenAI
console.log("=== TEST 1: Extracción de lugares ===");
const mockResponse1 =
	"Te recomiendo visitar Kotosh, que es un sitio arqueológico muy importante, y también la Plaza de Armas en el centro de Huánuco.";
const places1 = touristPlacesService.extractTouristPlaces(mockResponse1);
console.log("Respuesta:", mockResponse1);
console.log(
	"Lugares extraídos:",
	places1.map((p) => p.title)
);

// Test 2: Respuesta general sobre turismo
console.log("\n=== TEST 2: Respuesta general ===");
const mockResponse2 =
	"Huánuco tiene muchos lugares turísticos que puedes visitar.";
const places2 = touristPlacesService.extractTouristPlaces(mockResponse2);
console.log("Respuesta:", mockResponse2);
console.log(
	"Lugares extraídos:",
	places2.map((p) => p.title)
);

// Test 3: Verificar detección de cards
console.log("\n=== TEST 3: Detección de cards ===");
const shouldShow1 = touristPlacesService.shouldShowCards(mockResponse1);
const shouldShow2 = touristPlacesService.shouldShowCards(
	"¿Cómo está el clima?"
);
console.log("Debería mostrar cards para respuesta turística:", shouldShow1);
console.log("Debería mostrar cards para pregunta de clima:", shouldShow2);

// Test 4: Búsqueda de imágenes
console.log("\n=== TEST 4: Búsqueda de imágenes ===");
console.log("Imagen para Kotosh:", imageSearchService.searchImage("kotosh"));
console.log(
	"Imagen para lugar inexistente:",
	imageSearchService.searchImage("lugar_inventado")
);

// Test 5: Todos los lugares disponibles
console.log("\n=== TEST 5: Lugares disponibles ===");
console.log(
	"Lugares en la base de datos:",
	touristPlacesService.getAllPlaces()
);

export default {
	touristPlacesService,
	imageSearchService,
};
