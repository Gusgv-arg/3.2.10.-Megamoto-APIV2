import { precios } from "../excel/listaDePrecios.js";

export const searchModelsByCC = (keywordsCilindradas) => {
	const results = precios.filter(
		(item) =>
			item.cilindradas === keywordsCilindradas && item.familia !== "BICICLETA"
	);
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
	}
};
//searchModelsByCC(250)