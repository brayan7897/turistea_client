import React from "react";

const FormattedText = ({ text, className = "" }) => {
	if (!text) return null;

	// Función para procesar texto con markdown básico
	const processText = (text) => {
		// Dividir por saltos de línea para mantener el formato
		const lines = text.split("\n");

		return lines.map((line, index) => {
			// Si la línea está vacía, mostrar un salto de línea
			if (line.trim() === "") {
				return <br key={index} />;
			}

			// Procesar markdown básico en la línea
			let processedLine = line;

			// Texto en negritas (**texto**)
			processedLine = processedLine.replace(
				/\*\*(.*?)\*\*/g,
				'<strong class="font-bold text-blue-600">$1</strong>'
			);

			// Texto en cursiva (*texto*)
			processedLine = processedLine.replace(
				/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g,
				'<em class="italic">$1</em>'
			);

			// Enlaces [texto](url)
			processedLine = processedLine.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">$1</a>'
			);

			// Listas con viñetas (• o -)
			if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
				return (
					<div key={index} className="flex items-start gap-2 my-1">
						<span className="text-blue-500 font-bold mt-1">•</span>
						<span
							className="flex-1"
							dangerouslySetInnerHTML={{
								__html: processedLine.replace(/^[•-]\s*/, ""),
							}}
						/>
					</div>
				);
			}

			// Listas numeradas
			const numberedMatch = line.match(/^(\d+\.)\s*(.*)$/);
			if (numberedMatch) {
				return (
					<div key={index} className="flex items-start gap-2 my-1">
						<span className="text-blue-600 font-bold">{numberedMatch[1]}</span>
						<span
							className="flex-1"
							dangerouslySetInnerHTML={{
								__html: numberedMatch[2],
							}}
						/>
					</div>
				);
			}

			// Texto normal
			return (
				<p
					key={index}
					className="mb-2 leading-relaxed"
					dangerouslySetInnerHTML={{ __html: processedLine }}
				/>
			);
		});
	};

	return (
		<div className={`formatted-text ${className}`}>{processText(text)}</div>
	);
};

export default FormattedText;
