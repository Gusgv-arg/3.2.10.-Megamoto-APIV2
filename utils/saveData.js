import fs from "fs";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);

let notifications = [];

export const saveData = async (data) => {
    notifications.push(data);

    const data2 = JSON.stringify(notifications, null, 2);

    try {
        await writeFileAsync("excel/notifications.json", data2, "utf-8");
        console.log("Notifications guardadas en notifications.json");
    } catch (err) {
        console.error("Hubo un error al guardar las notifications:", err);
    }
};