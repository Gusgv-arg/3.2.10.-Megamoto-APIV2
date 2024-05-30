//import { precios } from "../excel/listaDePrecios.js";
import Prices from "../models/prices.js";

export const searchModelsByCC = async (keywordsCilindradas) => {
	try {
		// Buscando modelos que no sean bicicletas y que coincidan con las cilindradas dadas
		let results = await Prices.find({
			cilindradas: keywordsCilindradas,
			familia: { $ne: "BICICLETA" },
		});

		if (results.length > 0) {
			const models = results
				.map(
					(modelo, index) =>
						`${index + 1}. Modelo ${modelo.modelo} marca ${
							modelo.marca
						} a $ ${modelo.precio.toLocaleString()}. Catálogo: ${modelo.url}`
				)
				.join("\n");
			return models;
		} else {
			// Encontrar el modelo con cilindradas más cercanas
			const closestCC = await Prices.aggregate([
				{
					$match: {
						familia: { $ne: "BICICLETA" },
					},
				},
				{
					$project: {
						modelo: 1,
						marca: 1,
						precio: 1,
						url: 1,
						cilindradas: 1,
						diferencia: {
							$abs: { $subtract: ["$cilindradas", keywordsCilindradas] },
						},
					},
				},
				{ $sort: { diferencia: 1 } },
				{ $limit: 1 },
			]);

			if (closestCC.length > 0) {
				results = await Prices.find({
					cilindradas: closestCC[0].cilindradas,
				});

				const models = results
					.map(
						(modelo, index) =>
							`${index + 1}. Modelo ${modelo.modelo} marca ${
								modelo.marca
							} a $ ${modelo.precio.toLocaleString()}. Catálogo: ${modelo.url}`
					)
					.join("\n");
				console.log("models!!!!!1!!!!!", models);
				return models;
			}
		}
	} catch (error) {
		console.error("Error buscando modelos por cilindradas:", error);
		throw error; // O manejar el error de manera que prefieras
	}
	//Buscando en el array
	/* const results = precios.filter(
		(item) =>indradas && item.familia !== "BICICLETA"
	);
			item.cilindradas === keywordsCil
	//console.log("results", results);
	if (results.length > 0) {
		const models = results
			.map(
				(modelo) =>
					`Modelo ${modelo.modelo} marca ${
						modelo.marca
					} a $ ${modelo.precio.toLocaleString()}. Catálogo: ${modelo.url}`
			)
			.join("\n");
		//console.log(models);
		return models;
	} else {
		const closestCC = precios
        .filter((item) => item.familia !== "BICICLETA")
        .reduce((prev, curr) =>
            Math.abs(curr.cilindradas - keywordsCilindradas) < Math.abs(prev.cilindradas - keywordsCilindradas) ? curr : prev
        );

    const models = precios.filter((item) => item.cilindradas === closestCC.cilindradas)
        .map(
            (modelo) =>
                `Modelo ${modelo.modelo} marca ${
                    modelo.marca
                } a $ ${modelo.precio.toLocaleString()}. Catálogo: ${modelo.url}`
        )
        .join("\n");
    //console.log(models);
    return models;
	} */
};
