import mongoose from "mongoose";

const botSwitchSchema = new mongoose.Schema(
	{
		//generalSwitch: { type: Boolean, enum: [on, off], required: true },
		generalSwitch: { type: String, enum: ['ON', 'OFF'], required: true },
	},
	{
		timestamps: true,
	}
);

const BotSwitch = mongoose.model(
	"BotSwitch",
	botSwitchSchema
);

export default BotSwitch;
