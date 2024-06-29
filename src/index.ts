import express from "express";
import { config } from "dotenv";

config();
const app = express();
const api = express.Router();

app.use("/api", api);
app.use("/", express.static( "public"));

api.get("/hello", (req, res) => {
	res.send("Hello World");
});

app.listen(process.env.PORT ?? 3000, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
})