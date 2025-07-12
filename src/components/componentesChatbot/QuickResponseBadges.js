import React from "react";

const QuickResponseBadges = ({ onQuickResponseSelect, responses }) => {
	// Versiones resumidas de las respuestas para enviar al modelo
	const getQuickMessage = (responseId) => {
		const messages = {
			"most-visited": "Muéstrame los lugares más visitados de Huánuco",
			recommended: "¿Qué lugares me recomiendas para visitar en Huánuco?",
			adventure: "Busco lugares de aventura y naturaleza en Huánuco",
			historical: "Quiero conocer lugares históricos de Huánuco",
			nearby: "¿Qué lugares hay cerca del centro de Huánuco?",
		};
		return messages[responseId] || `Información sobre ${responseId}`;
	};

	// Versiones cortas para mostrar en los botones
	const getShortTitle = (title) => {
		const shortTitles = {
			"🏆 Lugares más visitados": "🏆 Más visitados",
			"⭐ Lugares recomendados": "⭐ Recomendados",
			"🏔️ Aventura y naturaleza": "🏔️ Aventura",
			"🏛️ Lugares históricos": "🏛️ Históricos",
			"📍 Lugares cercanos": "📍 Cercanos",
		};
		return shortTitles[title] || title;
	};

	const handleBadgeClick = (response) => {
		const message = getQuickMessage(response.id);
		onQuickResponseSelect(message, response);
	};

	return (
		<div className="bg-white border-t border-gray-200 px-3 py-2">
			<div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 quick-badges-container">
				{responses.map((response) => (
					<button
						key={response.id}
						onClick={() => handleBadgeClick(response)}
						className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 border border-blue-200 hover:border-blue-300 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md active:scale-95">
						{getShortTitle(response.title)}
					</button>
				))}
			</div>
			<div className="text-center mt-1">
				<span className="text-xs text-gray-400">
					💡 Haz clic en cualquier opción para explorar
				</span>
			</div>
		</div>
	);
};

export default QuickResponseBadges;
