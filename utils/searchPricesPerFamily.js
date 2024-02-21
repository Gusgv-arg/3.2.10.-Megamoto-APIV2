import { precios } from "../excel/listaDePreciosXFamilia.js";

export const searchPricesPerFamily = (family) => {
	let familyLower = family.toLowerCase();

	// Transform Blitz family to 110
	if (familyLower === "blitz") {
		familyLower = "110";
	}

	const prices = precios.filter(
		(item) => item.familia.toLowerCase() === familyLower
	);
	if (prices.length > 0) {
		const modelPrices = prices[0].modelos
			.map(
				(modelo) =>
					`${modelo.Modelo} marca ${
						modelo.Marca
					} a $ ${modelo.Precio.toLocaleString()}`
			)
			.join("\n");
		return modelPrices;
	} else {
		const disculpas =
			"Pide disculpas al cliente diciendo que no pudiste encontrar su modelo y que para poder proporcionarle el precio nos deberá consultar por alguna de las siguientes familias disponibles: 110 o Blitz, 180, 251, 302, 502, 752, Imperiale, Leoncino, TNT, TRK, Keeway, RK, CG, DLX, MAX, Sirius, SKUA, Strato, XMN, AX, AG, GSX, City y Citycom.";
            return disculpas
	}
};
