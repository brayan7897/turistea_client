import React, { Fragment , useState } from "react";


function Card(props){
  
  const {card} = props;

  const [modal , switchModal] = useState(false);

  const vModal = modal ? "absolute  w-full h-full z-50 bg-colorwo p-4" : "hidden";

  const toggleModal = () => {
    if (modal) {
      switchModal(false)
    } else {
      switchModal(true)
    
    }
    
  }

  



  return(
    <Fragment>

    
      <div key={card.id} className=" max-w-[90%] h-80 z-20 bg-colorwo rounded-2xl grid grid-rows-2 ">
        <span className="w-full h-1/4"><img src={card.content.card.imageUri} alt='imagen no disponible' className="w-full rounded-t-2xl object-cover"></img> </span>
          <div className="flex flex-col justify-between text-colorb">
            <div className="px-3 pt-20 gap-2">
              <p className="text-left font-bold text-sm">{card.content.card.title}</p>
              <p className="text-left font-normal text-xs">{card.content.card.buttons[0].postback}</p>
            </div>
            <button className="w-full h-8 rounded-b-2xl font-medium hover:bg-colorwc hover:text-colorwo" onClick={toggleModal}>Seleccionar</button>
          </div>
      </div>

      <div className={vModal}>
      <span  className="final w-full h-1/4"><img src={card.content.card.imageUri} alt='imagen no disponible' className="w-full rounded-2xl object-cover"></img> </span>
         <p className="text-colorwc text-center py-4 font-bold">{card.content.card.title}</p>
         <p className="text-justify text-colorwc">{card.content.card.subtitle}</p>

         <p className="text-colorwc text-center py-4 font-bold">Ubicación</p>
         <p className="text-justify text-colorwc">{card.content.card.buttons[0].text}</p>

         <p></p>

       <button className="py-4  w-full mt-4 bg-colorp opacity-40 rounded-lg justify-center" onClick={toggleModal}>Salir</button>
      </div>
      
      </Fragment>
  );
}

export default Card;
