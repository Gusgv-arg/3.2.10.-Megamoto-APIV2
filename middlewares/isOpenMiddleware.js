import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config;

export const isOpenMiddleware = (req, res, next) => {
	const data = req.body;
	const name = data.prospect?.firstName
		? data.prospect.firstName
		: data.message?.visitor.name
		? data.message.visitor.name
		: data.webUser
		? data.webUser
		: "No name";

	const now = moment().tz("America/Argentina/Buenos_Aires");
	const day = now.day(); // Domingo = 0, Lunes = 1, ..., Sábado = 6
	const hour = now.hours();
	const currentDate = now.format("MM-DD"); // Formato mes-día
	console.log("now:", now);
	console.log("day:", day);
	console.log("hour:", hour);
	console.log("name:", name);

	const isWeekday = day >= 1 && day <= 5; // Lunes a Viernes
	const isSaturday = day === 6; // Sábado
	const isSunday = day === 0; // Domingo
	console.log("isSaturday:", isSaturday);

	const holidays = process.env.HOLIDAYS.split(",");

	const weekdayStartHour = parseInt(process.env.WEEKDAY_START_HOUR, 10);
	const weekdayEndHour = parseInt(process.env.WEEKDAY_END_HOUR, 10);
	const weekendStartHour = parseInt(process.env.WEEKEND_START_HOUR, 10);
	console.log("weekensStartHour:", weekendStartHour);

	const isEveningOrNight = hour >= weekdayStartHour || hour < weekdayEndHour; // 7pm a 9am
	const isHoliday = holidays.includes(currentDate);
	console.log("isholiday", isHoliday)
	
	if (
		(isWeekday && isEveningOrNight) ||
		(isSaturday && hour >= weekendStartHour) ||
		isSunday ||
		(isWeekday && hour < weekdayEndHour) ||
		name === "Gustavo Gomez Villafañe" ||
		name === "Gg" ||
		isHoliday
	) {
		next();
	} else {
		// Exit the process
		console.log(
			"Exiting the process according Megamoto opening schedule:",
			now
		);
		res.status(200).send("MegaBot no está disponible en este horario.");
		return;
	}
};
