import bot from '../../assets/img/bot-conversacional.png'
import {useState,useEffect} from "react";
import Axios from "axios"

const ListadoMensajes = () => {

    const [mensaje , guardarMensaje ] = useState({texto:''})



    const [conversations , guardarConversaciones] = useState([])
    
    const convers = [{texto:'ratas'}]
     
    
    
     useEffect(() => {
    eventQuery('Welcome')
     },[])
    
    
    
    
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
    
    
      
    }
    
    
    
    
    
     const textQuery = async (text) => {
           //let conversations=[]
            //  First  Need to  take care of the message I sent     
      let conversation = {
        who: 'user',
        content: {
            text: {
                text: text
            }
        }
    }
    
    console.log(conversation);
    convers.push(conversation)
    guardarConversaciones([...conversations,conversation])
    
        const paraenviarTexto = {text}
           
            try {
                
              const response = await Axios.post('https://dd57-2800-200-f8c8-89c8-5979-9109-2cef-a101.ngrok.io/api/agent/text',paraenviarTexto)
    
              //for (let content of response.data.fulfillmentMessages) {
              let content = response.data.fulfillmentMessages[0];
    
                 conversation = {
                    who: 'bot',
                    content: content
                }
    
    
                console.log(conversation);
    
             guardarConversaciones([...conversations,conversation])
             convers.push(conversation)
              
            } catch (error) {
    
                conversation = {
                    who: 'bot',
                    content: {
                        text: {
                            text: " Error"
                        }
                    }
                }
    
             
                console.log(conversation);
           guardarConversaciones([...conversations,conversation])
           convers.push(conversation)
            
          
          
          }
         
    
          }
    
    
          
    
     const eventQuery = async (event) => {
           //let conversations=[]
    
            
           const paraenviarEvento = {event}
           
            try {
                
              const response = await Axios.post('https://dd57-2800-200-f8c8-89c8-5979-9109-2cef-a101.ngrok.io/api/agent/event',paraenviarEvento)
    
    
              let content = response.data.fulfillmentMessages[0];
    
                let conversation = {
                    who: 'bot',
                    content: content
                }
          
                console.log(conversation);
    guardarConversaciones([...conversations,conversation])
    convers.push(conversation)
    console.log(convers);
    
            } catch (error) {
    
              
              let conversation = {
                    who: 'bot',
                    content: {
                        text: {
                            text: " Error"
                        }
                    }
                }
                console.log(conversation);
           guardarConversaciones([...conversations,conversation])
           convers.push(conversation)
            }
    
    
          }
    


   
    return(  
    
    <ul className="grid p-4 gap-4">

    {
    conversations.map((chat,index) => (

     chat.who === 'bot' ? (
         <li key={index} className="w-4/5 justify-self-start grid grid-cols-4 p-2 shadow-sm bg-red-400 gap-4 rounded-t-2xl rounded-br-2xl break-words">
          
           <div className="bg-red-500 p-2 rounded-full border-4 border-red-200 ">
             <img className="w-8" src={bot} alt="bot" />
           </div>

           <div className='text-sm text-white col-span-3'>{chat.content.text.text}</div>
         </li>    
         ):(

         <li key={index} className="w-4/5 justify-self-end p-2 bg-blue-500 rounded-l-2xl rounded-tr-2xl ">
           <span className="text-sm text-white">{chat.content.text.text}</span>
         </li>
         )
         
         
   ))}

       </ul>
       
    )


}

export default ListadoMensajes;