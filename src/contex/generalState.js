import {useReducer} from "react";
import generalContext from "./generalContext";
import generalReducer from "./generalReducer";
import { AGREGAR_M, TOOGLE_MODAL } from "../types";
import { v4 as uuidv4 } from 'uuid';
const GeneralState = props =>{

const initialState = {
  chatCompleto: [],
  modal:false,
}


const [state , dispatch] = useReducer(generalReducer, initialState)


const agregarMensaje = (mensaje)=>{
    mensaje.id = uuidv4()
    dispatch({
        type:AGREGAR_M,
        payload:mensaje
    })
}

const mostrarModal = ()=> {
  dispatch({
    type:TOOGLE_MODAL
  })
}

return (
	<generalContext.Provider
	value = {{
	  chatCompleto:state.chatCompleto,
    modal:state.modal,
      agregarMensaje,
      mostrarModal
	}}
	>
	{props.children}
	</generalContext.Provider>
    )
}

export default GeneralState