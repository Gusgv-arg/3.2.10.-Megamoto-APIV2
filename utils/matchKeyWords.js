import { checkAllModels } from "./checkAllModels.js";
import { searchPricesPerFamily } from "./searchPricesPerFamily.js";

export const matchkeyWords = (newMessage) => {
	let instructions = "";

	const keywordsPrice =
		/(precio|precios|que valor|valores|cuanto sale|cuanto vale|que sale|que vale|cual es el valor)/i;
	const keywordsFinance =
		/(préstamo|prestamo|financiación|a pagar|financiado|financiar|sin interes|sin intereses)(?!.*(?:tarjeta de crédito|tarjeta de débito|transferencia))/i;
	const keywordsCuota =
		/(cuota|cuotas|credito|crédito|pagar por mes|pago mensual)/i;
	const keywordsPago =
		/(efectivo|tarjeta de débito|tarjeta de debito|débito|debito|transferencia|tarjeta|tarjeta de crédito|tarjeta de credito)/i;
	const keywordsCompetitors =
		/(zanella|honda|hond|hnda|mondial|mundial|yamaha|fz|smash|gilera|kawasaki|corven)(?!.*\b110\b)/i;
	const keywordsUsed = /(usado|usados|usada|usadas)/i;
	const keywordsOnlyNumbers =
		/^(?!100$|125$|135$|149$|150$|180$|200$|250$|300$|302$|390$|400$|450$|500$|502$|600$|650$|750$|752$|202$|251$|1000$|1200$|1300$)\d+$/;
	const keywordsCilindradas =
		/\b(?:100|125|135|149|150|200|202|250|300|390|400|450|500|600|650|750|1000|1200|1300)(?:c{1,2})\b/gi;	
	const keywordsModels =
		/\b(?:110|180|251|302|502|752|imperiale|leoncino|tnt|trk|keeway|rk|blitz|blitz 110|cg|dlx|max|sirius|skua|strato|xmn|ax|gn|gsx|city|citycom)\b/gi;
	const keywordsBicicleta = /(bici|bicicleta|bicis|bicicletas)/i;
	const keywordsTrabajo =
		/(currículum|cv|busco trabajo|busco empleo|búsqueda de trabajo|búsqueda de empleo|quiero trabajar)/i;
	const keywordsEnvios = /(envíos|envío|envio|envios|envían|envian)/i;
	const keywordsPlace =
		/(de donde son|donde estan|donde se encuentran|donde|son de)/i;

	const matchPrice = newMessage.receivedMessage.match(keywordsPrice);
	const matchFinance = newMessage.receivedMessage.match(keywordsFinance);
	const matchCuota = newMessage.receivedMessage.match(keywordsCuota);
	const matchPago = newMessage.receivedMessage.match(keywordsPago);
	const matchCompetitors =
		newMessage.receivedMessage.match(keywordsCompetitors);
	const matchUsed = newMessage.receivedMessage.match(keywordsUsed);
	const matchNumbers = newMessage.receivedMessage.match(keywordsOnlyNumbers);
	const matchCilindradas =
		newMessage.receivedMessage.match(keywordsCilindradas);
	const matchModels = newMessage.receivedMessage.match(keywordsModels);
	const matchBicicleta = newMessage.receivedMessage.match(keywordsBicicleta);
	const matchTrabajo = newMessage.receivedMessage.match(keywordsTrabajo);
	const matchEnvios = newMessage.receivedMessage.match(keywordsEnvios);
	const matchPlace = newMessage.receivedMessage.match(keywordsPlace);

	if (matchPrice) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPrice[0]}`
		);

		const priceInstructions =
			"Como tú no tienes la lista de precios, y estos te serán provistos mediante instrucciones específicas, si el cliente no envió en este mensaje el modelo del cual quiere saber el precio, pídele que te confirme el modelo para que puedas informarle correctamente en un paso posterior.";

		instructions = instructions + priceInstructions;
	}
	if (matchFinance) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchFinance[0]}`
		);

		const financeInstructions =
			"El cliente está expresando que pretende la financiación como método de pago, solicitale el DNI y explícale que un vendedor hará la verificación para saber si califica para un crédito. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor.";

		instructions = instructions + financeInstructions;
		return { dni: "dni", financeInstructions };
	}
	if (matchCuota) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchCuota[0]}`
		);

		const cuotaInstructions =
			"El cliente está expresando que pretende pagar en cuotas. Pregunta al cliente si se trata de un préstamo o un pago con la tarjeta de crédito. Si es un préstamo deberás solicitar el DNI para que un vendedor verifique si califica o no; y si es con tarjeta no hace falta solicitar nada.";

		instructions = instructions + cuotaInstructions;
		return { cuota: "cuota", cuotaInstructions };
	}
	if (matchPago) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPago[0]}`
		);

		const pagoInstructions =
			"El cliente está expresando su método de pago para el cual no hace falta saber su DNI (no expliques esto al cliente). Si el cliente ya informó el modelo de interes, despídete diciendole que será contactado en breve por un vendedor.";

		instructions = instructions + pagoInstructions;
		return { pago: "pago", pagoInstructions };
	}
	if (matchCompetitors) {
		console.log(
			`In the mssage of ${newMessage.name} appears the word ${matchCompetitors[0]}`
		);

		const competitorInstructions =
			"Responde al cliente que Megamoto comercializa las marcas Benelli, Suzuki, Motomel, Keeway y Sym; y termina tu frase tratando de indagar las necesidades del cliente como ser las cilindradas para poder comprender lo que está buscando el cliente.";

		instructions = instructions + competitorInstructions;
	}
	if (matchUsed) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchUsed[0]}`
		);
		const usedInstructions =
			"Si el cliente consulta por una moto usada, responde que Megamoto vende motos nuevas e intenta convencerlo sobre la conveniencia de comprar una moto nueva ya que en la actualidad no existe mucha diferencia de precios entre la usada y la nueva. También puedes hacer mención sobre la posibilidad de financiación para comprar una moto nueva.";
		instructions = instructions + usedInstructions;
	}
	if (matchNumbers) {
		console.log(`In the message of ${newMessage.name} there are only numbers`);
		const numbersInstructions =
			"Si el cliente envió el DNI aclara que un vendedor se encargará de verificar si califica para un crédito y si el cliente informó su modelo de interes despídete diciendo que un vendedor lo estará contactando a la brevedad. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor.";
		instructions = instructions + numbersInstructions;
	}
	if (matchCilindradas) {
		console.log(
			`In the message of ${newMessage.name} appears ${matchCilindradas[0]}. He is refering to cc.`
		);
		const cilindradasInstructions = `El cliente seguramente este consultando por modelos que tengan ${matchCilindradas[0]} cilindradas. Responde con al menos tres modelos que más se acerquen a las cilindradas solicitadas por el cliente de acuerdo al listado de modelos que comercializa Megamoto con sus cilindradas.`;
		instructions = instructions + cilindradasInstructions;
	}

	if (matchModels) {
		console.log(
			`In the message of ${newMessage.name} appears the model ${matchModels[0]}`
		);
		let allModels = checkAllModels(newMessage, keywordsModels);
		console.log("all models", allModels);
		let allModelsList = "";
		const modelsInstructions = allModels.map((model) => {
			let oneModel = searchPricesPerFamily(model);
			allModelsList = `${allModelsList} ${oneModel}\n`;
		});
		console.log("allModels:", allModelsList);

		const modelInstructions = `Si el cliente está decidiendo el modelo o consultando por precio responde con el detalle completo de todos los modelos disponibles para que tenga todas las opciones: ${allModelsList} y termina tu respuesta aclarando que los precios incluyen patentamiento, no incluyen el sellado de CABA y deberán ser confirmados por un vendedor. Si el cliente está informando la moto que quiere comprar, confirma el modelo y solo si ha confirmado el mismo pregunta por el método de pago."`;
		console.log("model instructions-->", modelInstructions);
		return { model: "model", modelInstructions };
	}

	if (matchBicicleta) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchBicicleta[0]}`
		);

		const bicicletaInstructions =
			"Responde que Megamoto comercializa bicicletas de las marcas Scott, Orbea, Tecnial y Shiro; y solicita al cliente que te envíe los detalles de lo que está buscando y que un vendedor lo estará contactando.";

		instructions = instructions + bicicletaInstructions;

		return { bici: "bici", bicicletaInstructions };
	}
	if (matchTrabajo) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchTrabajo[0]}`
		);

		const trabajoInstructions =
			"Si el cliente está buscando trabajo responde que en estos momentos Megamoto no está contratando personal pero puede enviar su currículum por esta vía o a megamoto@megamoto.com.ar";

		instructions = instructions + trabajoInstructions;

		return { trabajo: "trabajo", trabajoInstructions };
	}
	if (matchEnvios) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchEnvios[0]}`
		);
		const enviosInstructions =
			"Si el cliente consulta por envíos al interior del país, responde que sí es posible. Los detalles sobre la metodología y costos asociados lo informará el vendedor.";
		instructions = instructions + enviosInstructions;
	}
	if (matchPlace) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPlace[0]}`
		);
		const placeInstructions =
			"El cliente seguramente esté consultando por la ubicación de las sucursales de Megamoto, de ser así responde con la información sobre la ubicación de las dos sucursales que tiene Megamoto.";
		instructions = instructions + placeInstructions;
	}

	return instructions;
};
