const clientsToProcess = 20;
let clientsProcessed = 0;
const clients = new Set(); 

export const quantityToProcess = (req, res, next) => {
	const prospectId = req.body.prospect?.id;

	// Verifica si el prospectId ya ha sido procesado o si es una respuesta de un vendedor
	if (
		(clients.has(prospectId))
	) {
		next();
	} else if (
		(clientsProcessed <= clientsToProcess && req.body.type === "created" && req.body.interaction.proactive === false)
	) {
		// Si aún no se ha alcanzado el límite y el ID no está en el conjunto
		clients.add(prospectId);
		clientsProcessed++;
		console.log("Clientes procesados", clients);
		next();
	} else {
		// Cortar si se ha alcanzado el límite de clientes a procesar
		console.log(
			`Maximum of ${clientsToProcess} clients to process reached. Exiting process!`
		);
		res.status(200).send("Received")
		return;
	}
};
