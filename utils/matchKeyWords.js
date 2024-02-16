export const matchkeyWords = (newMessage) => {
	let instructions = "";

	const keywordsPrice =
		/(precio|precios|que valor|valores|cuanto sale|cuanto vale|que sale|que vale|cual es el valor)/i;
	const keywordsFinance =
		/(cuota|cuotas|crédito|financiación|a pagar|financiado|financiar|sin interes|sin intereses)(?!.*(?:tarjeta de crédito|tarjeta de débito|transferencia))/i;
	const keywordsCompetitors =
		/(zanella|honda|mondial|yamaha|smash|gilera|kawasaki)(?!.*\b110\b)/i;
		const keywordsUsed = /(usado|usados|usada|usadas)/i;
	const keywordsOnlyNumbers =
		/^(?!100$|125$|135$|150$|180$|200$|250$|300$|390$|400$|450$|500$|502$|600$|650$|750$|752$|202$|251$|1000$|1200$|1300$)\d+$/;
	const keywordsModels =
		/\b(?:100|125|135|150|180|200|250|300|390|400|450|500|502|600|650|750|752|202|251|1000|1200|1300)\b/;
	const keywordsModel110 = /\b(?:110)\b/;
	const keywordsBicicleta = /(bici|bicicleta|bicis|bicicletas)/i;
	const keywordsTrabajo =
		/(currículum|cv|busco trabajo|busco empleo|búsqueda de trabajo|búsqueda de empleo|quiero trabajar)/i;
	const keywordsEnvios = /(envíos|envío|envio|envios|envían|envian)/i;
	const keywordsPlace = /(de donde son|donde estan|donde se encuentran|donde|son de)/i;

	const matchPrice = newMessage.receivedMessage.match(keywordsPrice);
	const matchFinance = newMessage.receivedMessage.match(keywordsFinance);
	const matchCompetitors =
		newMessage.receivedMessage.match(keywordsCompetitors);
	const matchUsed = newMessage.receivedMessage.match(keywordsUsed);
	const matchNumbers = newMessage.receivedMessage.match(keywordsOnlyNumbers);
	const matchModels = newMessage.receivedMessage.match(keywordsModels);
	const matchModel110 = newMessage.receivedMessage.match(keywordsModel110);
	const matchBicicleta = newMessage.receivedMessage.match(keywordsBicicleta);
	const matchTrabajo = newMessage.receivedMessage.match(keywordsTrabajo);
	const matchEnvios = newMessage.receivedMessage.match(keywordsEnvios);
	const matchPlace = newMessage.receivedMessage.match(keywordsPlace);

	if (matchModel110) {
		console.log(`In the message of ${newMessage.name} appears the word 110`);

		const model110Instructions = `Si el cliente no especifica un modelo específico de 110, responde con esta frase: "Nuestro modelo más económico de 110 es la BLITZ 110 V8 START a $ 955.658. El precio es con patentamiento incluido, no incluye impuesto a los sellos de CABA y es a confirmar por un vendedor". Si el cliente no ha informado aún su método de pago, completa tu respuesta consultando al cliente por el método de pago.`;

		instructions = instructions + model110Instructions;
	}

	if (matchPrice) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchPrice[0]}`
		);

		const priceInstructions =
			"Si el cliente consulta precio de una moto, informa el mismo de acuerdo a tu fuente de información sobre Megamoto utilizando las columnas modelo y sinónimos; y como siempre aclara al cliente que el precio incluye patentamiento, que no incluye el impuesto a los sellos de CABA y que es a confirmar por un vendedor. Para tu información, el impuesto a los sellos de CABA es del 3% y se cobra a quienes habitan esta ciudad. Tienes prohibido inforar más de tres precios. Si alguien solicita más cantidad de precios responde que un vendedor se encargará de hacerlo. Si el cliente no ha informado aún su método de pago, completa tu respuesta consultando al cliente por el método de pago.";

		instructions = instructions + priceInstructions;
	}
	if (matchFinance) {
		console.log(
			`In the message of ${newMessage.name} appears the word ${matchFinance[0]}`
		);

		const financeInstructions =
			"El cliente está expresando que pretende la financiación como método de pago. Solicitale el DNI y explícale que un vendedor hará la verificación para saber si califica para un crédito. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor.";

		instructions = instructions + financeInstructions;
		return { dni: "dni", financeInstructions };
	}
	if (matchCompetitors) {
		console.log(
			`In the mssage of ${newMessage.name} appears the word ${matchCompetitors[0]}`
		);

		const competitorInstructions =
			"Aclara al cliente que Megamoto comercializa las marcas Benelli, Suzuki, Motomel, Keeway y Sym y ofrece al cliente alternativas de modelos (sin los precios) que comercializa Megamoto disponibles en tu fuente de información sobre Megamoto.";

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
		console.log(
			`In the message of ${newMessage.name} there are only numbers`
		);

		const numbersInstructions =
			"El cliente envió o bien su teléfono o su DNI. Agradece, y si corresponde a un DNI aclara que un vendedor se encargará de verificar si califica para un crédito. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor. Si el cliente ya ha informado previamente todos los datos de acuerdo a tus objetivos (modelo y método de pago), despídete diciendo que un vendedor lo estará contactando a la brevedad.";

		instructions = instructions + numbersInstructions;
	}
	if (matchModels) {
		console.log(
			`In the message of ${newMessage.name} appears the word model ${matchModels[0]}`
		);

		const modelInstructions =
			"El cliente se está refiriendo a un modelo de moto o a las cilindradas. Preguntale si puede ser más específico brindando el nombre completo del modelo.";

		instructions = instructions + modelInstructions;
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
			"El cliente seguramente esté consultando por la ubicación de las sucursales de Megamoto, de ser así responde con la información sobre la ubicación de las mismas.";
		instructions = instructions + placeInstructions;
	}

	return instructions;
};
