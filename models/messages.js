import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		id_user: { type: String, required: true },
		role: { type: String, required: true },
		content: { type: String, required: true },
		id_message: {type: String, required: true},
		channel: { type: String, required: true },	
		thread_id: {type: String},	
		instructions: {type: String}		
	},
	{
		timestamps: true,
	}
);

const Messages = mongoose.model("Messages", messageSchema);
export default Messages;
