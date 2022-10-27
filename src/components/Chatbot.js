import bot from '../assets/img/bot-conversacional.png'
import {useState,useEffect} from "react";
import Axios from "axios"
import generalContext from '../contex/generalContext';
import { useContext } from 'react';
import { Card } from "./componentesChatbot/card.js"



const Chatbot = () => {

useEffect(()=>{
  eventQuery('bienvenida')
  console.log('me estoy renderizando');
}, [])

const generalsContext = useContext(generalContext)
const {chatCompleto , agregarMensaje} = generalsContext;

const [mensaje , guardarMensaje ] = useState({texto:''})


//Abrir el espacio de widgets
const [openWidget, setopenWidget] = useState(false);

const [cards, setCards] = useState([]);

const eventOpenWidget = () => {
  if (openWidget) {
    setopenWidget(false);
  } else {
    setopenWidget(true);
  }
};

const eventAddCard = (url,id,title,ubicacion)=>{
  const newCards = [...cards];
  newCards.push({
    url: url,
    id: id,
    title: title,
    ubicacion: ubicacion
  });
  setCards(newCards);
}
const eventDeletCards = ()=>{
  const newCards = [];
  setCards(newCards);
}

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
            
          const response = await Axios.post('https://mysterious-bastion-07423.herokuapp.com/api/agent/text',paraenviarTexto)

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
            
          const response = await Axios.post('https://mysterious-bastion-07423.herokuapp.com/api/agent/event',paraenviarEvento)

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

        <section className={`bg-white h-full overflow-y-scroll no-scrollbar`}>
          
          <ul className="grid p-4 gap-4">
 {
      
      chatCompleto.map((chat) => (
      
        chat.who === 'user' ? (
           
            <li key={chat.id} className="max-w-[60%] justify-self-end p-2 bg-coloru rounded-l-2xl rounded-tr-2xl ">
              <span className="flex text-left text-sm px-2 text-colorb flex-nowrap">{chat.content.text.text}</span>
            </li>
           
        ):(

            <li key={chat.id} className="flex max-w-[60%]  justify-self-start p-2 shadow-sm bg-colorm gap-4 rounded-t-2xl rounded-br-2xl break-words">
              <div className="bg-red-500 p-2 rounded-full border-4 border-red-200 ">
                <img className="w-8 object-cover" src={bot} alt="bot" />
              </div>
              <div className='text-sm pr-2 text-colorb'>{chat.content.text.text}</div>
            </li>

          )
        )
      )
    }

          </ul>


        </section>

            <section
              className={`${!openWidget && "h-0"} ${
                openWidget && "h-4/5"
              } transition-all text-center`}
            >
              <button
                className={`border-none text-2xl text-colorwc p-0 ${
                  !openWidget && "hidden"
                } ${openWidget && "inline"}`}
                onClick={eventOpenWidget && eventDeletCards}
              >
                <i className={`fa-solid fa-x`}></i>
              </button>
              <div
                className={`w-full h-full p-4 flex gap-4 border-2 border-t-colorwc border-l-colorwc border-r-colorwc border-b-colorb overflow-y-hidden overflow-x-scroll no-scrollbar`}
              >
              {
                cards.map((card)=>(
                  <Card
                    url={card.url}
                    id={card.id}
                    title={card.title}
                    ubicacion={card.ubicacion}
                  ></Card>
                ))
              }
              </div>
            </section>
      
        <section
              className={`bg-colorb w-full p-2 flex-nowrap overflow-x-scroll overflow-y-hidden no-scrollbar ${
                !openWidget && "flex"
              } ${openWidget && "hidden"}`}
            >
              <span className="h-10 min-w-[20%] max-w-[50%] bg-colorwc flex  items-center overflow-hidden whitespace-nowrap text-ellipsis  px-2 py-3 rounded-2xl text-grey-900 text-sm cursor-pointer hover:bg-colorwo hover:text-colorb">
                <p>Muestame los lugares turisticos</p>
              </span>
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
