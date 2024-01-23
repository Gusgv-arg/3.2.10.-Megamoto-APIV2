import mongoose from "mongoose";

const repeatedMessagesSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		id_user: { type: String, required: true },
		content: { type: String, required: true },
		id_message: {type: String, required: true},
		channel: { type: String, required: true },
        webhook_timestamp: {type: String},			
	},
	{
		timestamps: true,
	}
);

const Webhook_Repeated_Messages = mongoose.model("Webhook_Repeated_Messages", repeatedMessagesSchema);
export default Webhook_Repeated_Messages;
