// Configuración de Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	// Iconos para el mapa y navegación
	faMap,
	faMapMarkerAlt,
	faMapMarkedAlt,
	faMapPin,
	faRoute,
	faCompass,
	faLocationArrow,
	faDirections,

	// Iconos para lugares turísticos
	faMonument,
	faHotel,
	faUtensils,
	faMountain,
	faTree,
	faChurch,
	faBridge,
	faLandmark,
	faWater,
	faBuilding,

	// Iconos para información
	faInfoCircle,
	faStar,
	faPhone,
	faGlobe,
	faEnvelope,

	// Iconos para interfaz
	faTimes,
	faChevronLeft,
	faChevronRight,
	faSearch,
	faPaperPlane,
	faSpinner,
	faCheck,
	faExclamationTriangle,
	faHandPointer,

	// Iconos para actividades
	faCamera,
	faHiking,
	faSwimmer,
	faBinoculars,

	// Iconos adicionales
	faClock,
	faCalendar,
	faUsers,
	faGift,
	faHeart,
	faShare,
	faDownload,
	faEye,
	faLightbulb,

	// Iconos para el componente Info mejorado
	faAward,
	faBrain,
	faMobileAlt,
	faDatabase,
	faArrowRight,
	faArrowLeft,

	// Iconos para MapaInteractivo estilizado
	faCrosshairs,
	faCheckCircle,
	faExpandArrowsAlt,
	faSatellite,
	faSearchPlus,
	faMouse,
	faExpand,
	faShieldAlt,
	faBolt,
	faCog,
} from "@fortawesome/free-solid-svg-icons";

// Agregar todos los iconos a la librería
library.add(
	// Mapa y navegación
	faMap,
	faMapMarkerAlt,
	faMapMarkedAlt,
	faMapPin,
	faRoute,
	faCompass,
	faLocationArrow,
	faDirections,

	// Lugares turísticos
	faMonument,
	faHotel,
	faUtensils,
	faMountain,
	faTree,
	faChurch,
	faBridge,
	faLandmark,
	faWater,
	faBuilding,

	// Información
	faInfoCircle,
	faStar,
	faPhone,
	faGlobe,
	faEnvelope,

	// Interfaz
	faTimes,
	faChevronLeft,
	faChevronRight,
	faSearch,
	faPaperPlane,
	faSpinner,
	faCheck,
	faExclamationTriangle,
	faHandPointer,

	// Actividades
	faCamera,
	faHiking,
	faSwimmer,
	faBinoculars,

	// Adicionales
	faClock,
	faCalendar,
	faUsers,
	faGift,
	faHeart,
	faShare,
	faDownload,
	faEye,
	faLightbulb,

	// Info mejorado
	faAward,
	faBrain,
	faMobileAlt,
	faDatabase,
	faArrowRight,
	faArrowLeft,

	// Mapa estilizado
	faCrosshairs,
	faCheckCircle,
	faExpandArrowsAlt,
	faSatellite,
	faSearchPlus,
	faMouse,
	faExpand,
	faShieldAlt,
	faBolt,
	faCog
);
