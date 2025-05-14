import React, { useState } from "react";

function Card(props) {
	const { card } = props;
	const [modal, switchModal] = useState(false);
	//const generalsContext = useContext(generalContext)
	//const {modal , mostrarModal} = generalsContext;

	const vModal = modal
		? "absolute top-0 left-0 w-full h-hidden z-50 bg-colorwo p-4 overflow-x-hidden"
		: "hidden";

	const toggleModal = () => {
		// mostrarModal()

		if (modal) {
			switchModal(false);
		} else {
			switchModal(true);
		}
	};

	/*
  if (cards.length === 0) {
    return
  }

  
*/
	console.log(card);
	return (
		<div>
			<div className=" w-80 h-80  bg-colorwo rounded-2xl grid grid-rows-2">
				<span className="w-full h-1/4">
					<img
						src={card.imageUrl.stringValue}
						alt="imagen no disponible"
						className="w-full rounded-t-2xl object-cover"></img>{" "}
				</span>
				<div className="flex flex-col justify-between text-colorb">
					<div className="px-3 pt-20 gap-2">
						<p className="text-left font-bold text-sm">
							{card.title.stringValue}
						</p>
						<p className="text-left font-normal text-xs">
							{card.buttonUrl.stringValue}
						</p>
					</div>
					<button
						className="w-full h-8 rounded-b-2xl font-medium hover:bg-colorwc hover:text-colorwo"
						onClick={() => toggleModal()}>
						Seleccionar
					</button>
				</div>
			</div>

			<div className={vModal}>
				<span className="final w-full h-1/4">
					<img
						src={card.imageUrl.stringValue}
						alt="imagen no disponible"
						className="w-full rounded-2xl object-cover"></img>{" "}
				</span>
				<p className="text-colorwc text-center py-4 font-bold">
					{card.title.stringValue}
				</p>
				<p className="text-justify text-colorwc">{card.text.stringValue}</p>

				<p className="text-colorwc text-center py-4 font-bold">Ubicación</p>
				<p className="text-justify text-colorwc">
					{card.buttonText.stringValue}
				</p>

				<p></p>

				<button
					className="py-4  w-full mt-4 bg-colorp opacity-40 rounded-lg justify-center"
					onClick={() => toggleModal()}>
					Salir
				</button>
			</div>
		</div>
	);
}

export default Card;
