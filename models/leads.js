import mongoose from "mongoose";

const leadsSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		id_user: { type: String, required: true },
		channel: { type: String, required: true },	
		content: { type: String, required: true },
		thread_id: {type: String},			
		contact_method: { type: String },
		address: { type: String },
		product: { type: String },
		payment: { type: String },
	},
	{
		timestamps: true,
	}
);

const Leads = mongoose.model("Leads", leadsSchema);
export default Leads;