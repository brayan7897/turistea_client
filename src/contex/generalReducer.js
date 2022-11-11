import { AGREGAR_M, TOOGLE_MODAL } from "../types";

export default (state,action)=>{

    switch(action.type){
    case AGREGAR_M:
        return{
            ...state,
            chatCompleto:[...state.chatCompleto,action.payload]
        }
    case TOOGLE_MODAL:
        return{
            ...state,
             modal:!state.modal
        }
    
    default:
         return state;
    }


}

