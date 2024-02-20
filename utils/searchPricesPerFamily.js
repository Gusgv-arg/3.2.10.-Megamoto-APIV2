import { precios } from "../excel/listaDePreciosXFamilia.js";

export const searchPricesPerFamily = (family) => {
	const prices = precios.filter((item) => item.familia.toLowerCase() === family);
	//console.log(`Precios de la familia ${family}: ${prices}`);
    console.log(`Precio de la familia ${family}: ${prices.length > 0 ? prices[0].modelos[0].Modelo : 'No se encontraron precios'}`);
    
    //let modelPrices= JSON.stringify(prices[0].modelos);
    const modelPrices = prices[0].modelos.map(modelo => `${modelo.Modelo} marca ${modelo.Marca} a $ ${modelo.Precio.toLocaleString()}`).join('\n');
    console.log(modelPrices)
    return modelPrices
};
