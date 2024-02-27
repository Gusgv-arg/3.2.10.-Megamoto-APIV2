export const excludeProactive = (messages) => {
	const uniqueProspects = {};

	messages.forEach((message) => {
		if (
			!(message.senderId in uniqueProspects) 
		) {
			uniqueProspects[message.senderId] = {
				senderId: message.senderId,
				createdAt: message.createdAt,  
				output: message.output,
				source: message.source,
				proactive: message.proactive,				
			};
		} else {
            uniqueProspects[message.senderId].output += `.${message.output}`;
			message.proactive === true ? uniqueProspects[message.senderId].proactive = true : uniqueProspects[message.senderId].proactive;
		}
	});

	return Object.values(uniqueProspects);
};
