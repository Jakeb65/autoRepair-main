import { get } from "./db.js";

const mail = "test@example.com";
const user = await get<any>(`SELECT id, mail, rola, haslo FROM users WHERE mail = ?`, [mail]);

console.log("USER ROW:", user);
process.exit(0);
