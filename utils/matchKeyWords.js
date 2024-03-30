import { checkAllModels } from "./checkAllModels.js";
import { searchPricesPerFamily } from "./searchPricesPerFamily.js";
import { searchModelsByCC } from "./searchModelsByCC.js";
import {
	bicicletaInstructions,
	cilindradasInstructions,
	competitorInstructions,
	cuotaInstructions,
	enviosInstructions,
	financeInstructions,
	modelInstructions1,
	modelInstructions2,
	numbersInstructions,
	pagoInstructions,
	trabajoInstructions,
	usedInstructions,
} from "./instructions.js";

export const matchkeyWords = async (newMessage) => {
	let instructions = "";

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
		/^(?!100$|110$|125$|135$|149$|150$|180$|200$|202$|250$|251$|300$|302$|390$|400$|450$|500$|502$|600$|650$|750$|752$|1000$|1200$|1300$)\d{7,}$/;

	//const keywordsCilindradas =
	/\b(100|110|125|135|149|150|200|250|300|390|400|450|500|600|650|750|1000|1200|1300)(?![0-9])([a-zA-Z?!.]*)/gi;
	const keywordsCilindradas =
		/(?:\b)(100|110|125|135|149|150|200|250|300|390|400|450|500|600|650|750|1000|1200|1300)(?![0-9])/g;
	const characterModels =
		/(?:\b|\d)(imperiale|benelli 400|benelli400|benelli 251|benelli 500|trail|benelli 15|benelli 600|benelli 502|leoncino|tnt|trk|light|rk|keeyway 150|blitz|v8|one|plus|tunning|tuning|tunnin|tunin|cg|s2|dlx|deluxe|max|sirius|skua|strato|xmn|ax|gn|gsx|city|citycom|sym 300|motocargo|cargo|xtreme|x-treme|motomel 125|motomel 150|new generation|motomel 150|silver|motomel 250|adventure|euro|alpino|tarpan|suzuki 100|suzuki 125)(?:\b|\d)/gi;
	const numericModels = /(?<![0-9])(180|190|202|251|302|502|752)(?![0-9])/gm;
	const keywordsBicicleta = /(bici|bicicleta|bicis|bicicletas)/i;
	const keywordsTrabajo =
		/(currículum|cv|busco trabajo|busco empleo|búsqueda de trabajo|búsqueda de empleo|quiero trabajar)/i;
	const keywordsEnvios = /(envíos|envío|envio|envios|envían|envian)/i;

	const matchCompetitors =
		newMessage.receivedMessage.match(keywordsCompetitors);
	const matchCharacterModels =
		newMessage.receivedMessage.match(characterModels);
	const matchNumericModels = newMessage.receivedMessage.match(numericModels);

	const matchCilindradas =
		newMessage.receivedMessage.match(keywordsCilindradas);
	const matchCuota = newMessage.receivedMessage.match(keywordsCuota);
	const matchFinance = newMessage.receivedMessage.match(keywordsFinance);
	const matchPago = newMessage.receivedMessage.match(keywordsPago);
	const matchUsed = newMessage.receivedMessage.match(keywordsUsed);
	const matchNumbers = newMessage.receivedMessage.match(keywordsOnlyNumbers);
	const matchBicicleta = newMessage.receivedMessage.match(keywordsBicicleta);
	const matchTrabajo = newMessage.receivedMessage.match(keywordsTrabajo);
	const matchEnvios = newMessage.receivedMessage.match(keywordsEnvios);

	let instructionsQuantity = 0;
	let modelInstructions = "";

	if (matchCompetitors) {
		console.log(
			`In the mssage of ${newMessage.name} appears the word ${matchCompetitors[0]}`
		);
		instructionsQuantity++;
		instructions = instructions + competitorInstructions;
	}

	if (matchCharacterModels) {
		console.log(
			`In the message of ${newMessage.name} appears the model ${matchCharacterModels[0]}`
		);

		let allModels = checkAllModels(newMessage, characterModels);
		//console.log("all models", allModels);
		let allModelsList = "";
		
		for (const model of allModels) { 
            let oneModel = await searchPricesPerFamily(model); 
            allModelsList = `${allModelsList} ${oneModel}\n`;
        }
		//console.log("allModels:", allModelsList);
		instructionsQuantity++;
		instructions =
			instructions + modelInstructions1 + allModelsList + modelInstructions2;
	}
	if (matchNumericModels) {
		console.log(
			`In the message of ${newMessage.name} appears the model ${matchNumericModels[0]}`
		);

		let allModels = checkAllModels(newMessage, numericModels);
		//console.log("all models", allModels);
		let allModelsList = "";
		
		for (const model of allModels) { 
            let oneModel = await searchPricesPerFamily(model); 
            allModelsList = `${allModelsList} ${oneModel}\n`;
        }
		//console.log("allModels:", allModelsList);
		instructionsQuantity++;
		instructions =
			instructions + modelInstructions1 + allModelsList + modelInstructions2;
	}

	if (matchCilindradas) {
		console.log(
			`In the message of ${newMessage.name} appears ${matchCilindradas[0]}. He is refering to cc.`
		);
		console.log("matchcilindros", matchCilindradas[0]);
		const modelsByCC = await searchModelsByCC(parseInt(matchCilindradas[0], 10));

		if (modelInstructions === "") {
			instructionsQuantity++;
			instructions =
				instructions +
				instructionsQuantity +
				". " +
				cilindradasInstructions +
				modelsByCC;
		}
	}

	if (matchFinance) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchFinance[0]}`
		);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + financeInstructions;
	}
	if (matchCuota) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchCuota[0]}`
		);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + cuotaInstructions;
	}

	if (matchPago) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPago[0]}`
		);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + pagoInstructions;
	}

	if (matchNumbers) {
		console.log(`In the message of ${newMessage.name} there are only numbers`);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + numbersInstructions;
	}

	if (matchUsed) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchUsed[0]}`
		);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + usedInstructions;
	}

	if (matchBicicleta) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchBicicleta[0]}`
		);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + bicicletaInstructions;
	}
	if (matchTrabajo) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchTrabajo[0]}`
		);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + trabajoInstructions;
	}
	if (matchEnvios) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchEnvios[0]}`
		);
		instructionsQuantity++;
		instructions =
			instructions + instructionsQuantity + ". " + enviosInstructions;
	}

	let moreThanOneInstruction;

	if (instructionsQuantity === 1) {
		return instructions;
	} else if (instructionsQuantity > 1) {
		if (matchCompetitors) {
			instructions = competitorInstructions;
			return instructions;
		}
		let moreThanOneInstruction = `Debes responder considerando estos ${instructionsQuantity} aspectos:\n`;
		return `${moreThanOneInstruction}${instructions}`;
	} else {
		return instructions;
	}
	return instructions;
};
