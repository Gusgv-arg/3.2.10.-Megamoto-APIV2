export const matchkeyWords = (newMessage) => {
	let instructions = "";

	const keywordsPrice =
		/(precio|precios|valor|valores|cuanto sale|cuanto|que sale)/i;
	const keywordsFinance =
		/(cuota|cuotas|crédito|financiación|tarjeta|tarjetas|a pagar|financiado|financiar)/i;
	const keywordsCompetitors =
		/(zanella|honda|mondial|yamaha|smash|gilera|kawasaki)/i;
	const keywordsUsed = /(usado|usados|usada|usadas)/i;
	const keywordsOnlyNumbers =
		/^(?!100$|110$|125$|135$|150$|180$|200$|250$|300$|390$|400$|450$|500$|502$|600$|650$|750$|752$|202$|251$|1000$|1200$|1300$)\d+$/;
	const keywordsModels =
		/\b(?:100|125|135|150|180|200|250|300|390|400|450|500|502|600|650|750|752|202|251|1000|1200|1300)\b/;
	const keywordsModel110 = /\b(?:110)\b/;

	const matchPrice = newMessage.receivedMessage.match(keywordsPrice);
	const matchFinance = newMessage.receivedMessage.match(keywordsFinance);
	const matchCompetitors =
		newMessage.receivedMessage.match(keywordsCompetitors);
	const matchUsed = newMessage.receivedMessage.match(keywordsUsed);
	const matchNumbers = newMessage.receivedMessage.match(keywordsOnlyNumbers);
	const matchModels = newMessage.receivedMessage.match(keywordsModels);
	const matchModel110 = newMessage.receivedMessage.match(keywordsModel110);

	if (matchPrice) {
		console.log(
			`En el msje de ${newMessage.name} se detectó la palabra ${matchPrice[0]}`
		);

		const priceInstructions =
			"Informa el precio de acuerdo a tu fuente de información sobre Megamoto utilizando las columnas modelo y sinónimos; y como siempre aclara que el precio incluye patentamiento, que el mismo no incluye el impuesto a los sellos de CABA y que es a confirmar por un vendedor.";

		instructions = instructions + priceInstructions;
	}
	if (matchFinance) {
		console.log(
			`En el msje de ${newMessage.name} se detectó la palabra ${matchFinance[0]}`
		);

		const financeInstructions =
			"Solicita el DNI al cliente para que un vendedor pueda verificar si califica para un crédito. Y ten en cuenta que no estas autorizado para verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota, esto lo realiza el vendedor, por lo que no afrezcas esto al cliente.";

		instructions = instructions + financeInstructions;
	}
	if (matchCompetitors) {
		console.log(
			`En el msje de ${newMessage.name} se detectó la palabra ${matchCompetitors[0]}`
		);

		const competitorInstructions =
			"Aclara al cliente que Megamoto comercializa las marcas Benelli, Suzuki, Motomel, Keeway y Sym y ofrece al cliente alternativas de modelos que comercializa Megamoto disponibles en tu fuente de información sobre Megamoto.";

		instructions = instructions + competitorInstructions;
	}
	if (matchUsed) {
		console.log(
			`En el msje de ${newMessage.name} se detectó la palabra ${matchUsed[0]}`
		);

		const usedInstructions =
			"Si el cliente consulta por una moto usada, responde que Megamoto vende motos nuevas e intenta convencerlo sobre la conveniencia de comprar una moto nueva ya que en la actualidad no existe mucha diferencia de precios entre la usada y la nueva. También puedes hacer mención sobre la posibilidad de financiación para comprar una moto nueva.";

		instructions = instructions + usedInstructions;
	}
	if (matchNumbers) {
		console.log(`En el msje de ${newMessage.name} se detectaron solo números`);

		const numbersInstructions =
			"El cliente envió o bien su teléfono o su DNI. Responde solicitando aquellos datos que el cliente no hay proporcionado de acuerdo a tus objetivos (modelo de moto, localidad, método de pago, teléfono y DNI si va a pagar financiado).";

		instructions = instructions + numbersInstructions;
	}
	if (matchModels) {
		console.log(
			`En el msje de ${newMessage.name} se detectó un posible modelo ${matchModels[0]}`
		);

		const modelInstructions =
			"El cliente se está refiriendo a un modelo de moto o a las cilindradas. Preguntale si puede ser más específico brindando el nombre completo del modelo.";
		
		instructions = instructions + modelInstructions;
	}
	if (matchModel110) {
		console.log(`En el msje de ${newMessage.name} aparece la palabra 110`);

		const model110Instructions = `Si el cliente no especifica un modelo específico de 110, responde con esta frase: "Nuestro modelo más económico de 110 es la BLITZ 110 V8 START a $ 955.658. El precio es con patentamiento incluido, no incluye impuesto a los sellos de CABA y es a confirmar por un vendedor".`;

		instructions = instructions + model110Instructions;
		
	}

	return instructions;
};
