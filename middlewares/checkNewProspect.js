export const checkNewProspect = (req, res, next) => {
	const prospectCreatedDate = new Date(req.body.prospect.created.slice(0, 10));
	const name = req.body.prospect?.firstName;

	console.log(`\n${name} was created on the ${prospectCreatedDate}`);

	const targetDate = new Date("2024-02-12");
	
	if (prospectCreatedDate >= targetDate || name === "Gustavo Gomez Villafañe" || name === "Gg") {
		console.log(`Process continues for ${name}, created after ${targetDate}`);
		next();
	} else {
		res.status(200).send("Received");
		console.log(`Exit the process for ${name}. Created before: ${targetDate}`);
		return;
	}
}
