
import {useState,useEffect} from "react";
import Axios from "axios"
import generalContext from '../contex/generalContext';
import { useContext } from 'react';
//import Card from "./componentesChatbot/Card";
import Mensajes from './componentesChatbot/Mensajes';
import ListCards from "./componentesChatbot/ListCards";
import MapV from "./componentesChatbot/Map";


const Chatbot = () => {

useEffect(()=>{
  eventQuery('bienvenida')
  console.log('me estoy renderizando');
}, [])

const generalsContext = useContext(generalContext)
const {chatCompleto , agregarMensaje} = generalsContext;

const [mensaje , guardarMensaje ] = useState({texto:''})


const onchangeMensaje = (e) => {
  guardarMensaje({
    ...mensaje,
    [e.target.name]: e.target.value,
  });
};


const onSubmitMensaje = e =>{
e.preventDefault();

if (mensaje.texto === '') {
  return;
}

guardarMensaje(mensaje)

textQuery(mensaje.texto)

guardarMensaje({texto:''})

}

 const textQuery = async (text) => {
   
  let conversation = {
    who: 'user',
    content: {
        text: {
            text: text
        }
    }
}

agregarMensaje(conversation)

   const paraenviarTexto = {text}
       
        try {
            
          const response = await Axios.post('https://126e-2800-200-f8c8-89c8-3db9-6278-90a9-88b3.ngrok.io/api/agent/text',paraenviarTexto)

          for (let content of response.data.fulfillmentMessages) {
          //let content = response.data.fulfillmentMessages[0];

             conversation = {
                who: 'bot',
                content: content
            }

       
            agregarMensaje(conversation)
            console.log(conversation)
          }
            
          
        } catch (error) {

            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: " Error"
                    }
                }
            }

      agregarMensaje(conversation)
      console.log(conversation)
      
      }
     

      }

 const eventQuery = async (event) => {
   
        
       const paraenviarEvento = {event}
       
        try {
            
          const response = await Axios.post('https://126e-2800-200-f8c8-89c8-3db9-6278-90a9-88b3.ngrok.io/api/agent/event',paraenviarEvento)

          for (let content of response.data.fulfillmentMessages) {
         // let content = response.data.fulfillmentMessages[0];

            let conversation = {
                who: 'bot',
                content: content
            }

          agregarMensaje(conversation)   
                 console.log(conversation)
          }


        } catch (error) {

          
          let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: " Error"
                    }
                }
            }
            agregarMensaje(conversation)
            console.log(conversation)
        }


      }
  
    
      

  return (
    <section className="w-2/4 flex flex-row  justify-self-end">
      <div className="h-4/5 w-1/2 bg-red-700 my-auto mx-auto mt-20 rounded-2xl shadow-2xl flex flex-col">
        <header className=" rounded-t-2xl bg-colors">
          <div className="text-colorb font-semibold text-xl text-center py-2">
            <h1 className="">Turistea</h1>
          </div>
        </header>

        <section className={` bg-white h-full overflow-y-scroll no-scrollbar`}>
          
          <ul className="relative grid  gap-2 p-2" >
 {
      
      chatCompleto.map((chat) => (

        chat.content.payload ?
        ( 
          chat.content.payload.fields.type.stringValue === 'carousel' ?
        <ListCards
          key={chat.id}
          payload={chat}/>
          :<MapV key={chat.id}
          payload={chat}/>


        )
         :(
         <Mensajes
          key={chat.id}
          chat={chat}/>
         )
       
        )
      )

 }
          </ul>

        </section>

        <footer className=" rounded-b-2xl bg-white p-2">
        
        <form onSubmit={onSubmitMensaje}>

          <div className="flex h-10">
           
            <input onChange={onchangeMensaje} value={mensaje.texto} name="texto" type="text" className="w-full p-4 rounded-bl-2xl outline-none" placeholder="Escriba su mensaje..."></input>

            <button className="w-20" type='submit'>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-send mx-auto px-2 pb-1"
               
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#545151"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </button>

          </div>
          </form>

        </footer>
      </div>
    </section>
  );
}

export default Chatbot;
