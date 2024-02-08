export const checkNewProspect = (req, res, next) => {
	const prospectCreatedDate = new Date(req.body.prospect.created.slice(0, 10));

	console.log("prospect date:", prospectCreatedDate);

	const targetDate = new Date("2024-02-01");

	if (prospectCreatedDate >= targetDate) {
		console.log(`Prospect was created after ${targetDate}, so the process continues.`);
		next();
	} else {
		res.status(200).send("Received");
		console.log(`Exit the process. Prospect was created before: ${targetDate}`);
		return;
	}
}
