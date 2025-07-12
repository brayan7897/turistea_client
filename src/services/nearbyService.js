import hotelsRestaurantsData from "../assets/json/hotels-restaurants.json";
import locationService from "./locationService";

class NearbyService {
	constructor() {
		this.hotelsData = hotelsRestaurantsData.hoteles || {};
		this.restaurantsData = hotelsRestaurantsData.restaurantes || {};
	}

	// Obtener hoteles cercanos
	async getNearbyHotels(maxDistance = 20) {
		try {
			// Intentar obtener ubicación del usuario
			await locationService.requestLocationPermission();
		} catch (error) {
			console.warn("No se pudo obtener ubicación, usando datos generales");
		}

		const hotels = Object.values(this.hotelsData)
			.filter((hotel) => hotel.activo)
			.map((hotel) => this.enrichHotelData(hotel));

		// Filtrar por proximidad si hay ubicación
		const nearbyHotels = locationService.filterByProximity(hotels, maxDistance);

		// Validar unicidad antes de retornar
		const uniqueNearbyHotels = this.validateUniqueEstablishments(nearbyHotels);

		// Si no hay hoteles cercanos, retornar los destacados
		if (uniqueNearbyHotels.length === 0) {
			const featuredHotels = hotels
				.filter((hotel) => hotel.destacado)
				.slice(0, 3)
				.map((hotel) => ({
					...hotel,
					distance: null,
					distanceFormatted: "Centro de Huánuco",
				}));

			return this.validateUniqueEstablishments(featuredHotels);
		}

		return uniqueNearbyHotels.slice(0, 5);
	}

	// Obtener restaurantes cercanos
	async getNearbyRestaurants(maxDistance = 15) {
		try {
			// Intentar obtener ubicación del usuario
			await locationService.requestLocationPermission();
		} catch (error) {
			console.warn("No se pudo obtener ubicación, usando datos generales");
		}

		const restaurants = Object.values(this.restaurantsData)
			.filter((restaurant) => restaurant.activo)
			.map((restaurant) => this.enrichRestaurantData(restaurant));

		// Filtrar por proximidad si hay ubicación
		const nearbyRestaurants = locationService.filterByProximity(
			restaurants,
			maxDistance
		);

		// Validar unicidad antes de retornar
		const uniqueNearbyRestaurants =
			this.validateUniqueEstablishments(nearbyRestaurants);

		// Si no hay restaurantes cercanos, retornar los destacados
		if (uniqueNearbyRestaurants.length === 0) {
			const featuredRestaurants = restaurants
				.filter((restaurant) => restaurant.destacado)
				.slice(0, 4)
				.map((restaurant) => ({
					...restaurant,
					distance: null,
					distanceFormatted: "Centro de Huánuco",
				}));

			return this.validateUniqueEstablishments(featuredRestaurants);
		}

		return uniqueNearbyRestaurants.slice(0, 6);
	}

	// Enriquecer datos del hotel para cards
	enrichHotelData(hotel) {
		return {
			id: `hotel_${hotel.nombre.replace(/\s+/g, "_").toLowerCase()}`,
			title: { stringValue: hotel.nombre },
			subtitle: { stringValue: hotel.descripcion },
			imageUrl: { stringValue: hotel.imagen },
			buttonUrl: { stringValue: hotel.direccion },
			coordinates: { stringValue: hotel.coordenadas },
			rating: { stringValue: hotel.calificacion.toString() },
			type: { stringValue: hotel.tipo },
			city: { stringValue: hotel.ciudad },
			phone: { stringValue: hotel.telefono },
			website: { stringValue: hotel.url },
			activities: { stringValue: hotel.actividades },
			tips: { stringValue: hotel.consejos },
			// Datos específicos de hoteles
			priceRange: hotel.precio_rango,
			services: hotel.servicios,
			featured: hotel.destacado,
		};
	}

	// Enriquecer datos del restaurante para cards
	enrichRestaurantData(restaurant) {
		return {
			id: `restaurant_${restaurant.nombre.replace(/\s+/g, "_").toLowerCase()}`,
			title: { stringValue: restaurant.nombre },
			subtitle: { stringValue: restaurant.descripcion },
			imageUrl: { stringValue: restaurant.imagen },
			buttonUrl: { stringValue: restaurant.direccion },
			coordinates: { stringValue: restaurant.coordenadas },
			rating: { stringValue: restaurant.calificacion.toString() },
			type: { stringValue: restaurant.tipo },
			city: { stringValue: restaurant.ciudad },
			phone: { stringValue: restaurant.telefono },
			website: { stringValue: restaurant.url },
			activities: { stringValue: restaurant.actividades },
			tips: { stringValue: restaurant.consejos },
			// Datos específicos de restaurantes
			cuisine: restaurant.cocina,
			specialties: restaurant.especialidades,
			priceRange: restaurant.precio_rango,
			featured: restaurant.destacado,
		};
	}

	// Obtener hoteles por rango de precios
	getHotelsByPriceRange(priceRange) {
		const hotels = Object.values(this.hotelsData)
			.filter((hotel) => hotel.activo && hotel.precio_rango === priceRange)
			.map((hotel) => this.enrichHotelData(hotel));

		return hotels;
	}

	// Obtener restaurantes por tipo de cocina
	getRestaurantsByCuisine(cuisineType) {
		const restaurants = Object.values(this.restaurantsData)
			.filter(
				(restaurant) => restaurant.activo && restaurant.cocina === cuisineType
			)
			.map((restaurant) => this.enrichRestaurantData(restaurant));

		return restaurants;
	}

	// Obtener establecimientos destacados
	getFeaturedEstablishments() {
		const featuredHotels = Object.values(this.hotelsData)
			.filter((hotel) => hotel.activo && hotel.destacado)
			.map((hotel) => this.enrichHotelData(hotel));

		const featuredRestaurants = Object.values(this.restaurantsData)
			.filter((restaurant) => restaurant.activo && restaurant.destacado)
			.map((restaurant) => this.enrichRestaurantData(restaurant));

		return {
			hotels: featuredHotels,
			restaurants: featuredRestaurants,
		};
	}

	// Búsqueda combinada de hoteles y restaurantes
	async getNearbyEstablishments(maxDistance = 20) {
		const [hotels, restaurants] = await Promise.all([
			this.getNearbyHotels(maxDistance),
			this.getNearbyRestaurants(maxDistance),
		]);

		return {
			hotels: hotels,
			restaurants: restaurants,
			total: hotels.length + restaurants.length,
		};
	}

	// Generar mensaje descriptivo para la respuesta del bot
	generateNearbyMessage(establishments, type = "establecimientos") {
		const { hotels, restaurants } = establishments;
		const totalCount = (hotels?.length || 0) + (restaurants?.length || 0);

		if (totalCount === 0) {
			return `No encontré ${type} cercanos a tu ubicación actual. Te muestro algunas opciones destacadas en el centro de Huánuco.`;
		}

		let message = `Encontré **${totalCount} ${type}** cerca de tu ubicación:\n\n`;

		if (hotels && hotels.length > 0) {
			message += `🏨 **${hotels.length} hoteles disponibles**\n`;
		}

		if (restaurants && restaurants.length > 0) {
			message += `🍽️ **${restaurants.length} restaurantes recomendados**\n`;
		}

		message += `\n📍 Los lugares se muestran ordenados por distancia. ¡Toca cualquier card para ver más detalles!`;

		return message;
	}

	// Validar unicidad de establecimientos para evitar duplicados
	validateUniqueEstablishments(establishments) {
		const seenNames = new Set();
		const seenCoordinates = new Set();

		return establishments.filter((establishment) => {
			const name = establishment.title?.stringValue?.toLowerCase();
			const coordinates = establishment.coordinates?.stringValue;

			// Verificar duplicados por nombre
			if (seenNames.has(name)) {
				return false;
			}

			// Verificar duplicados por coordenadas (mismo lugar físico)
			if (coordinates && seenCoordinates.has(coordinates)) {
				return false;
			}

			// Agregar a los sets si es único
			if (name) seenNames.add(name);
			if (coordinates) seenCoordinates.add(coordinates);

			return true;
		});
	}
}

export default new NearbyService();
