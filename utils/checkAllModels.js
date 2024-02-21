
export const checkAllModels = (newMessage, keywordsModels) => {
	const matchModels = newMessage.receivedMessage.matchAll(keywordsModels);
	const allModels = Array.from(matchModels, (m) => m[0]);
	return allModels;
};
