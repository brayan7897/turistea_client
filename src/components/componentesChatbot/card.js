import React from "react";

function Card(props){
  return(
      <div key={props.id} className="h-[90%] max-w-[60%] bg-colorwo rounded-2xl grid grid-rows-2 ">
        <span className="w-full h-1/4"><img className="w-full rounded-t-2xl object-cover"></img> </span>
          <div className="flex flex-col justify-between text-colorb">
            <div className="px-4 py-2 gap-2">
              <p className="text-left font-bold text-sm">Kotosh, Templo de las manos cruzadas</p>
              <p className="text-left font-normal text-xs">A 5 kilómetros de la ciudad de Huánuco</p>
            </div>
            <button className="w-full h-8 rounded-b-2xl font-medium hover:bg-colorwc hover:text-colorwo">Seleccionar</button>
          </div>
      </div>
  );
}

export { Card };
