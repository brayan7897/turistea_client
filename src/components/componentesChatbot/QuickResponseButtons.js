import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const QuickResponseButtons = ({ onQuickResponseSelect, responses }) => {
	return (
		<div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
			<div className="mb-3">
				<h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
					<FontAwesomeIcon icon="lightbulb" /> Respuestas rápidas
				</h3>
				<p className="text-xs text-gray-500">
					Haz clic en una opción para obtener información inmediata:
				</p>
			</div>
			<div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
				{responses.map((response) => (
					<button
						key={response.id}
						onClick={() => onQuickResponseSelect(response)}
						className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group">
						<div className="flex-1">
							<div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
								{response.title}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								{response.subtitle}
							</div>
						</div>
						<div className="ml-2 text-blue-400 group-hover:text-blue-600 transition-colors duration-200">
							<FontAwesomeIcon icon="chevron-right" className="w-4 h-4" />
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default QuickResponseButtons;
