import {useReducer} from "react";
import generalContext from "./generalContext";
import generalReducer from "./generalReducer";
import { AGREGAR_M } from "../types";
import { v4 as uuidv4 } from 'uuid';
const GeneralState = props =>{

const initialState = {
  chatCompleto: [],
}


const [state , dispatch] = useReducer(generalReducer, initialState)


const agregarMensaje = (mensaje)=>{
    mensaje.id = uuidv4()
    dispatch({
        type:AGREGAR_M,
        payload:mensaje
    })
}

return (
	<generalContext.Provider
	value = {{
	  chatCompleto:state.chatCompleto,
      agregarMensaje
	}}
	>
	{props.children}
	</generalContext.Provider>
    )
}

export default GeneralState