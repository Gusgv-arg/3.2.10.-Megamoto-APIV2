const clientsToProcess = 10;
let clientsProcessed = 0;
const clients = new Set(); // Usar un Set para almacenar IDs únicos

export const quantityToProcess = (req, res, next) => {
	const prospectId = req.body.prospect?.id;

	console.log("contactmediums", req.body.prospect.contactMediums)
	console.log("leads", req.body.prospect.leads)
	console.log("output", req.body.interaction.output.message)
	// Verifica si el prospectId ya ha sido procesado o si es una respuesta de un vendedor
	if (
		(clients.has(prospectId) && req.body.type === "updated") ||
		(clients.has(prospectId) && req.body.interaction.proactive === true)
	) {
		next();
	} else if (
		(clientsProcessed <= clientsToProcess && req.body.type === "created" && req.body.interaction.proactive === false)
	) {
		// Si aún no se ha alcanzado el límite y el ID no está en el conjunto
		clients.add(prospectId);
		clientsProcessed++;
		console.log(clients);
		next();
	} else {
		// Si se ha alcanzado el límite de clientes a procesar
		console.log(
			`Maximum of ${clientsToProcess} clients to process reached. Exiting process!`
		);
		return;
	}
};
