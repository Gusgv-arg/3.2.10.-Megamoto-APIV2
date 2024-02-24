import prospects from "../excel/prospectsData.js"

export const analyzeProspects = () => {
	const resultado = {};
	prospects.forEach((prospect) => {
		const { group, status, leads } = prospect;

		if (!resultado[group]) {
			resultado[group] = { total: 0, status: {} };
		}

		resultado[group].total += 1;

		if (!resultado[group].status[status]) {
			resultado[group].status[status] = { total: 0, source: {} };
		}

		resultado[group].status[status].total += 1;

		// Asumiendo que cada prospect tiene al menos un lead y nos interesa el source del primer lead
		const source = leads[0]?.source; // Usamos optional chaining para manejar casos donde leads pueda estar vacío
		if (source) {
			if (!resultado[group].status[status].source[source]) {
				resultado[group].status[status].source[source] = 0;
			}
			resultado[group].status[status].source[source] += 1;
		}
	});

	return resultado;
};
