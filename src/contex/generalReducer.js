import { AGREGAR_M } from "../types";

export default (state,action)=>{

    switch(action.type){
    case AGREGAR_M:
        return{
            ...state,
            chatCompleto:[...state.chatCompleto,action.payload]
        }
   
    default:
         return state;
    }


}

