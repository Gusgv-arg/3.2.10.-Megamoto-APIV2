//import prospects from "../excel/prospectsData.js"
import prospects from "../excel/allUnclaimedProspects.js";

export const analyzeProspectsData = () => {
	const analysis = {};
	let totalTotal = 0;
	let totalUnclaimed = 0;

	prospects.forEach((item) => {
		const date = item.created.substring(0, 10);

		if (!analysis[date]) {
			analysis[date] = { total: 0, unclaimed: 0 };
		}

		analysis[date].total++;

		if (item.status === "unclaimed") {
			analysis[date].unclaimed++;
		}

		totalTotal++;
		if (item.status === "unclaimed") {
			totalUnclaimed++;
		}
	});

	for (const date in analysis) {
		console.log(
			`Total ${date}: ${analysis[date].total} Unclaimed: ${analysis[date].unclaimed}`
		);
	}

    const analysisArray = Object.keys(analysis).map(date => ({
        date: date,
        total: analysis[date].total,
        unclaimed: analysis[date].unclaimed
    }));
	
    console.log(`Total: ${totalTotal} Unclaimed Total: ${totalUnclaimed}`);
	const result = `Total: ${totalTotal} Unclaimed Total: ${totalUnclaimed}`;
	//return {analysis, result};
    
    return analysisArray;

};

//analyzeProspectsData(prospects);
