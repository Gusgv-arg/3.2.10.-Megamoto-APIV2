export const matchkeyWords = (newMessage) => {
	let instructions = "";

	const keywordsPrice =
		/(precio|precios|valor|valores|cuanto sale|cuanto|que sale)/i;
	const keywordsFinance =
		/(cuota|cuotas|crédito|financiación|tarjeta|tarjetas)/i;
	const keywordsCompetitors =
		/(zanella|honda|mondial|yamaha|smash|gilera|kawasaki)/i;
	const keywordsUsed =
		/(usado|usados|usada|usadas)/i;

		

	const matchPrice = newMessage.receivedMessage.match(keywordsPrice);
	const matchFinance = newMessage.receivedMessage.match(keywordsFinance);
	const matchCompetitors = newMessage.receivedMessage.match(keywordsCompetitors);
	const matchUsed = newMessage.receivedMessage.match(keywordsUsed);

	if (matchPrice) {
		console.log(`En el msje de ${newMessage.name} se detectó la palabra ${matchPrice[0]}`)
		
		const priceInstructions = `Al informar precios aclara tres cosas: 1) El precio incluye patentamiento. 2) El precio No incluye el impuesto a los sellos de CABA. 3) El precio es a confirmar por un vendedor. Antes de enviar tu respuesta al cliente verifica la misma, ya que informar mal un precio es perjudicial para Megamoto y el cliente.`;
		
		instructions = instructions + priceInstructions;
	}
	if (matchFinance) {
		console.log(`En el msje de ${newMessage.name} se detectó la palabra ${matchFinance[0]}`)

		const financeInstructions = `Si el cliente está consultando por financiación, deberás solicitar el DNI para que un vendedor pueda verificar si califica para un crédito.`;

		instructions = instructions + financeInstructions;
	}
	if (matchCompetitors) {
		
		console.log(`En el msje de ${newMessage.name} se detectó la palabra ${matchCompetitors[0]}`)
		
		const competitorInstructions = `Aclara que Megamoto comercializa las marcas Benelli, Suzuki, Motomel, Keeway y Sym y sigue el proceso ofreciendo al cliente alternativas de modelos que comercializa Megamoto disponibles en la lista de precios.`;

		instructions = instructions + competitorInstructions;
	}
	if (matchUsed) {
		
		console.log(`En el msje de ${newMessage.name} se detectó la palabra ${matchUsed[0]}`)
		
		const usedInstructions = `Si el cliente consulta por una moto usada, responde que Megamoto vende motos nuevas y que en la actualidad no existe mucha diferencia de precio con la moto nueva; teniendo la posibilidad de financiación para llegar a esta última.`;

		instructions = instructions + usedInstructions;
	}
	return instructions;
};
