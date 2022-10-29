import React from "react";
import bot from '../../assets/img/bot-conversacional.png'

function Mensajes(props){
  
    const {chat} = props;

    const  stylos = chat.who === 'bot' ? "flex max-w-[100%]  justify-self-start p-2 shadow-sm bg-colorm gap-4 rounded-t-2xl rounded-br-2xl break-words" : "max-w-[100%] justify-self-end p-2 bg-coloru rounded-l-2xl rounded-tr-2xl "
    const vIcon = chat.who === 'bot' ? "bg-red-500 p-2 rounded-full border-4 border-red-200 " : "hidden"

    return(
     
    <li key={chat.id} className={stylos}>

        <div className={vIcon}>
                <img className="w-8 object-cover" src={bot} alt="bot" />
        </div>

    <span className="flex text-left text-sm px-2 text-colorb flex-nowrap ">{chat.content.text.text}</span>
    </li>
    
  );
}

export default Mensajes;
