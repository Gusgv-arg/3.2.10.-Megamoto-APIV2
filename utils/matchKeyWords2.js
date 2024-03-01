import { checkAllModels } from "./checkAllModels.js";
import { searchPricesPerFamily } from "./searchPricesPerFamily.js";

export const matchkeyWords2 = (newMessage) => {
	let instructions = "";

	const keywordsPrice =
		/(precio|precios|que valor|valores|cuanto sale|cuanto vale|que sale|que vale|cual es el valor)/i;
	const keywordsFinance =
		/(préstamo|prestamo|financiación|financiado|financiar|sin interes|sin intereses)(?!.*(?:tarjeta de crédito|tarjeta de débito|transferencia|tarjeta))/i;
	const keywordsCuota =
		/(cuota|cuotas|credito|crédito|pagar por mes|pago mensual|a pagar)/i;
	const keywordsPago =
		/(efectivo|tarjeta de débito|tarjeta de debito|débito|debito|transferencia|tarjeta|tarjeta de crédito|tarjeta de credito|contado)/i;
	const keywordsCompetitors =
		/zanella|honda|hond|hnda|mondial|mundial|yamaha|fz|smash|gilera|kawasaki|corven/i;
	const keywordsUsed = /(usado|usados|usada|usadas)/i;
	const keywordsOnlyNumbers =
		/^(?!100$|125$|135$|149$|150$|180$|200$|250$|300$|302$|390$|400$|450$|500$|502$|600$|650$|750$|752$|202$|251$|1000$|1200$|1300$)\d+$/;
	const keywordsCilindradas =
		/(?:\b(100|125|135|149|150|200|202|250|300|390|400|450|500|600|650|750|1000|1200|1300)\b)(?:cc|c{0,2})?\b/gi;
	const keywordsModels =
		/\b(?:110|180|251|302|502|752|imperiale|leoncino|tnt|trk|keeway|rk|blitz|blitz 110|cg|dlx|max|sirius|skua|strato|xmn|ax|gn|gsx|city|citycom)\b/gi;
	const keywordsBicicleta = /(bici|bicicleta|bicis|bicicletas)/i;
	const keywordsTrabajo =
		/(currículum|cv|busco trabajo|busco empleo|búsqueda de trabajo|búsqueda de empleo|quiero trabajar)/i;
	const keywordsEnvios = /(envíos|envío|envio|envios|envían|envian)/i;
	const keywordsPlace =
		/(de donde son|donde estan|donde se encuentran|donde|son de)/i;

	const matchCompetitors =
		newMessage.receivedMessage.match(keywordsCompetitors);
	const matchModels = newMessage.receivedMessage.match(keywordsModels);
	const matchCilindradas =
		newMessage.receivedMessage.match(keywordsCilindradas);
	const matchPrice = newMessage.receivedMessage.match(keywordsPrice);
	const matchCuota = newMessage.receivedMessage.match(keywordsCuota);
	const matchFinance = newMessage.receivedMessage.match(keywordsFinance);
	const matchPago = newMessage.receivedMessage.match(keywordsPago);
	const matchUsed = newMessage.receivedMessage.match(keywordsUsed);
	const matchNumbers = newMessage.receivedMessage.match(keywordsOnlyNumbers);
	const matchBicicleta = newMessage.receivedMessage.match(keywordsBicicleta);
	const matchTrabajo = newMessage.receivedMessage.match(keywordsTrabajo);
	const matchEnvios = newMessage.receivedMessage.match(keywordsEnvios);
	const matchPlace = newMessage.receivedMessage.match(keywordsPlace);

	let instructionsQuantity = 0;

	const competitorInstructions =
		"Sin excepción, responde al cliente que Megamoto comercializa las marcas Benelli, Suzuki, Motomel, Keeway y Sym. Si el cliente no informó las cilindradas que está buscando termina tu respuesta consultando por las mismas; y si las ha informado responde con 3 alternativas que más se acerquen (tienes esta información en el listado de modelos y cilindradas). Esta indicación está por sobre el resto ya que es importante que sepa que Megamoto no vende esa marca.\n";

	if (matchCompetitors) {
		console.log(
			`In the mssage of ${newMessage.name} appears the word ${matchCompetitors[0]}`
		);
		instructionsQuantity++;
		instructions = instructions + competitorInstructions;
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
		instructionsQuantity++;
		const modelInstructions = `${instructionsQuantity}. Envía al cliente el detalle completo de todos los modelos disponibles para que tenga todas las opciones: ${allModelsList}\nCompleta tu respuesta aclarando que los precios incluyen patentamiento, no incluyen el sellado de CABA y deberán ser confirmados por un vendedor. Si el cliente aún no eligió el modelo específico de acuerdo al listado, pregunta si puede informarte su modelo de elección. Si el cliente ya eligió del listado, termina tu respuesta preguntando por el método de pago.\n`;
		console.log("model instructions-->", modelInstructions);
		instructions = instructions + modelInstructions;
	}

	if (matchCilindradas) {
		console.log(
			`In the message of ${newMessage.name} appears ${matchCilindradas[0]}. He is refering to cc.`
		);
		instructionsQuantity++;

		const cilindradasInstructions = `${instructionsQuantity}. Lo más probable es que el cliente está consultando por modelos que tengan ${matchCilindradas[0]} cilindradas; responde con al menos tres opciones que más se acerquen a las cilindradas solicitadas buscando en el listado que tienes disponible.\n`;
		instructions = instructions + cilindradasInstructions;
	}

	if (matchPrice) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPrice[0]}`
		);

		instructionsQuantity++;
		const priceInstructions = `${instructionsQuantity}. Como tú no tienes la lista de precios, y estos te serán provistos mediante instrucciones específicas, si el cliente no envió en este mensaje el modelo del cual quiere saber el precio, pídele que te confirme el modelo para que puedas informarle correctamente en un paso posterior.\n`;
		instructions = instructions + priceInstructions;
	}

	if (matchFinance) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchFinance[0]}`
		);
		instructionsQuantity++;
		const financeInstructions = `${instructionsQuantity}. El cliente está expresando que pretende la financiación como método de pago, solicita el DNI y explíca que un vendedor hará la verificación para saber si califica para un crédito. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor.\n`;
		instructions = instructions + financeInstructions;
	}
	if (matchCuota) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchCuota[0]}`
		);
		instructionsQuantity++;
		const cuotaInstructions = `${instructionsQuantity}. El cliente está expresando que pretende pagar en cuotas. Pregunta al cliente si se trata de un préstamo o un pago con la tarjeta de crédito (esto será necesario para saber si necesitas solicitar el DNI).\n`;
		instructions = instructions + cuotaInstructions;
	}

	if (matchPago) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPago[0]}`
		);
		instructionsQuantity++;
		const pagoInstructions = `${instructionsQuantity}. El cliente está expresando su método de pago para el cual no hace falta saber su DNI (no expliques esto al cliente). Si el cliente ya informó el modelo de interes, puedes despedirte diciendole al cliente que será contactado en breve por un vendedor.\n`;
		instructions = instructions + pagoInstructions;
	}

	if (matchNumbers) {
		console.log(`In the message of ${newMessage.name} there are only numbers`);
		instructionsQuantity++;

		const numbersInstructions = `${instructionsQuantity}. Si el cliente envió el DNI aclara que un vendedor se encargará de verificar si califica para un crédito y si el cliente informó su modelo de interes puedes despedirte diciendo que un vendedor lo estará contactando a la brevedad. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor.\n`;

		instructions = instructions + numbersInstructions;
	}

	if (matchUsed) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchUsed[0]}`
		);
		instructionsQuantity++;

		const usedInstructions = `${instructionsQuantity}. Si el cliente consulta por una moto usada, responde que Megamoto vende motos nuevas e intenta convencerlo sobre la conveniencia de comprar una moto nueva ya que en la actualidad no existe mucha diferencia de precios entre la usada y la nueva. También puedes hacer mención sobre la posibilidad de financiación para comprar una moto nueva.\n`;

		instructions = instructions + usedInstructions;
	}

	if (matchBicicleta) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchBicicleta[0]}`
		);
		instructionsQuantity++;

		const bicicletaInstructions = `${instructionsQuantity}. Responde que Megamoto comercializa bicicletas de las marcas Scott, Orbea, Tecnial y Shiro; y solicita al cliente que te envíe los detalles de lo que está buscando y que un vendedor lo estará contactando.\n`;
		instructions = instructions + bicicletaInstructions;
	}
	if (matchTrabajo) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchTrabajo[0]}`
		);
		instructionsQuantity++;
		const trabajoInstructions = `${instructionsQuantity}. Si el cliente está buscando trabajo responde que en estos momentos Megamoto no está contratando personal pero puede enviar su currículum por esta vía o a megamoto@megamoto.com.ar\n`;
		instructions = instructions + trabajoInstructions;
	}
	if (matchEnvios) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchEnvios[0]}`
		);
		instructionsQuantity++;
		const enviosInstructions = `${instructionsQuantity}. Si el cliente consulta por envíos al interior del país, responde que sí es posible. Los detalles sobre la metodología y costos asociados lo informará el vendedor.\n`;
		instructions = instructions + enviosInstructions;
	}
	if (matchPlace) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPlace[0]}`
		);
		instructionsQuantity++;
		const placeInstructions = `${instructionsQuantity}. El cliente seguramente esté consultando por la ubicación de las sucursales de Megamoto, de ser así responde con la información sobre la ubicación de las dos sucursales que tiene Megamoto.\n`;
		instructions = instructions + placeInstructions;
	}

	let moreThanOneInstruction;

	if (instructionsQuantity === 1) {
		return instructions;
	} else if (instructionsQuantity > 1) {
		/* if (matchCompetitors){
			instructions = competitorInstructions 
			return instructions
		} */
		let moreThanOneInstruction = `Debes responder considerando estos ${instructionsQuantity} aspectos. Si uno de ellos implica aclarar que Megamoto no vende la marca solicitada, tendrás que enfocarte exclusivamente en este para evitar potenciales problemas con el cliente:\n`;
		return `${moreThanOneInstruction}${instructions}`;
	} else {
		return instructions;
	}

	return instructions;
};
