import React from "react";
import FormattedText from "../FormattedText";

function Mensajes(props) {
	const { chat } = props;

	// Verificar que el chat exista
	if (!chat) {
		return null;
	}

	const stylos =
		chat.who === "bot"
			? "flex max-w-[90%] w-fit justify-self-start p-3 shadow-sm bg-colorm gap-3 rounded-t-2xl rounded-br-2xl break-words word-wrap"
			: "flex max-w-[90%] w-fit justify-self-end p-3 bg-coloru rounded-l-2xl rounded-tr-2xl break-words word-wrap";

	const messageText = chat.content?.text?.text || "No hay mensaje disponible";

	// Obtener las iniciales según quien escriba
	const getInitials = () => {
		if (chat.who === "bot") {
			return "TR";
		} else {
			return "U"; // Iniciales del usuario, puedes cambiarlo por las iniciales reales del usuario
		}
	};

	// Estilos para el círculo de iniciales
	const circleStyles =
		chat.who === "bot"
			? "w-8 h-8 rounded-full bg-colorc2 text-colorb flex items-center justify-center text-xs font-bold flex-shrink-0"
			: "w-8 h-8 rounded-full bg-colorc1 text-white flex items-center justify-center text-xs font-bold flex-shrink-0";

	return (
		<div key={chat.id} className={`${stylos} mb-3`}>
			{chat.who === "bot" && (
				<div className={circleStyles}>{getInitials()}</div>
			)}
			<div className="flex-1 min-w-0 overflow-hidden">
				{chat.who === "bot" ? (
					<FormattedText
						text={messageText}
						className="text-left text-sm text-coloro1 font-medium leading-relaxed"
					/>
				) : (
					<span className="block text-left text-sm text-coloro1 font-medium leading-relaxed whitespace-pre-wrap break-words">
						{messageText}
					</span>
				)}
			</div>
			{chat.who === "user" && (
				<div className={circleStyles}>{getInitials()}</div>
			)}
		</div>
	);
}

export default Mensajes;
