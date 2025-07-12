import {
	AGREGAR_M,
	ELIMINAR_M,
	SET_LOADING,
	SET_ERROR,
	SET_LAST_CARDS_ADDED,
} from "../types";

export default (state, action) => {
	switch (action.type) {
		case AGREGAR_M:
			return {
				...state,
				chatCompleto: [...state.chatCompleto, action.payload],
			};
		case ELIMINAR_M:
			return {
				...state,
				chatCompleto: state.chatCompleto.filter(
					(mensaje) => mensaje.id !== action.payload
				),
			};
		case SET_LOADING:
			return {
				...state,
				isLoadingResponse: action.payload,
			};
		case SET_ERROR:
			return {
				...state,
				error: action.payload,
			};
		case SET_LAST_CARDS_ADDED:
			return {
				...state,
				lastCardsAdded: action.payload,
			};

		default:
			return state;
	}
};
