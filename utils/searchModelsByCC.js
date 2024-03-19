import { cilindradas } from "../excel/modelosXCilindradas.js";

export const searchModelsByCC = (keywordsCilindradas) => {
	// Convertir la entrada a un número para coincidir con las claves numéricas del objeto
	const ccNumber = parseInt(keywordsCilindradas, 10);

	const cilindradasKeys = Object.keys(cilindradas.cilindradas).map(Number);

	// Verificar si existe la propiedad con el número de cilindrada en el objeto
	if (cilindradas.cilindradas.hasOwnProperty(ccNumber)) {
		const models = cilindradas.cilindradas[ccNumber];
		const modelOptions = models
			.map(
				(modelo) =>
					`${modelo.modelo} marca ${modelo.marca} a $ ${modelo.precio.toLocaleString()}. <a href="${modelo.url}">Catálogo</a>\n`
			)
			.join("\n");
		console.log("model options cc", modelOptions);
		return modelOptions;
	} else {
		// Encontrar las cilindradas más cercanas
		const closestCC = cilindradasKeys.reduce((prev, curr) =>
			Math.abs(curr - ccNumber) < Math.abs(prev - ccNumber) ? curr : prev
		);

		// Obtener modelos para las cilindradas más cercanas
		const models = cilindradas.cilindradas[closestCC];
		const modelOptions = models
			.map(
				(modelo) =>
					`El modelo más cercano en cilindradas que vende Megamoto es: ${modelo.modelo} marca ${modelo.marca} a $ ${modelo.precio.toLocaleString()}. <a href="${modelo.url}">Catálogo</a>\n`
			)
			.join("\n");

		console.log("model options cc", modelOptions);
		return modelOptions;
	}
};
