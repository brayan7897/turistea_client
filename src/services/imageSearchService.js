// Servicio para obtener imágenes de lugares turísticos
class ImageSearchService {
	constructor() {
		// Base de datos local de imágenes de lugares turísticos de Huánuco
		this.imageDatabase = {
			// Huánuco Ciudad
			huanuco:
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/5c/plaza-de-armas-de-huanuco.jpg",
			"plaza de armas":
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/5c/plaza-de-armas-de-huanuco.jpg",
			catedral:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Catedral_de_Hu%C3%A1nuco.jpg/1200px-Catedral_de_Hu%C3%A1nuco.jpg",

			// Sitios arqueológicos
			kotosh:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Templo_Blanco_de_Kotosh_amb_l%27edifici_del_Templo_de_las_Manos_darrera03.jpg/1280px-Templo_Blanco_de_Kotosh_amb_l%27edifici_del_Templo_de_las_Manos_darrera03.jpg",
			yarowilca:
				"https://www.tuentrada.com.pe/wp-content/uploads/2023/09/Complejo-arqueologico-Yarowilca.jpg",
			garu: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Garu_archaeological_site.jpg/1200px-Garu_archaeological_site.jpg",

			// Tingo María
			"tingo maria":
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/15/0a/42/cueva-de-las-lechuzas.jpg",
			"cueva de las lechuzas":
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/15/0a/42/cueva-de-las-lechuzas.jpg",
			"parque nacional tingo maria":
				"https://www.sernanp.gob.pe/documents/10181/165108/Tingo+Mar%C3%ADa/f4c8e7c4-0f7a-4c8b-9f3e-8c1c2d3e4f5g",
			"bella durmiente":
				"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bella_Durmiente_Tingo_Maria.jpg/1200px-Bella_Durmiente_Tingo_Maria.jpg",

			// Lugares naturales
			carpish:
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/3d/abismos-de-carpish.jpg",
			"bosque de piedras":
				"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bosque_de_Piedras_Huayllay.jpg/1200px-Bosque_de_Piedras_Huayllay.jpg",
			"puente calicanto":
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/4e/puente-calicanto-huanuco.jpg",

			// Lagunas y ríos
			"laguna lauricocha":
				"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Laguna_Lauricocha.jpg/1200px-Laguna_Lauricocha.jpg",
			"rio huallaga":
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/2a/rio-huallaga.jpg",

			// Pueblos típicos
			llata:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Llata_Huanuco.jpg/1200px-Llata_Huanuco.jpg",
			panao:
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/1c/panao-huanuco.jpg",
			churubamba:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Churubamba_vista.jpg/1200px-Churubamba_vista.jpg",

			// Default fallback
			default:
				"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f9/5c/plaza-de-armas-de-huanuco.jpg",
		};
	}

	// Buscar imagen por nombre del lugar
	searchImage(placeName) {
		if (!placeName) return this.imageDatabase.default;

		const normalizedName = placeName.toLowerCase().trim();

		// Buscar coincidencia exacta
		if (this.imageDatabase[normalizedName]) {
			return this.imageDatabase[normalizedName];
		}

		// Buscar coincidencia parcial
		for (const [key, url] of Object.entries(this.imageDatabase)) {
			if (normalizedName.includes(key) || key.includes(normalizedName)) {
				return url;
			}
		}

		// Si no encuentra, devolver imagen por defecto
		return this.imageDatabase.default;
	}

	// Obtener múltiples imágenes para una lista de lugares
	searchMultipleImages(places) {
		return places.map((place) => ({
			place: place,
			imageUrl: this.searchImage(place),
		}));
	}

	// Agregar nueva imagen a la base de datos
	addImage(placeName, imageUrl) {
		const normalizedName = placeName.toLowerCase().trim();
		this.imageDatabase[normalizedName] = imageUrl;
	}

	// Obtener todas las imágenes disponibles
	getAllImages() {
		return this.imageDatabase;
	}
}

export default new ImageSearchService();
