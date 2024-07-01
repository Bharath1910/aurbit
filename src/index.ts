import express from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import login from "./routes/auth/login";
import signup from "./routes/auth/signup";

config();
const app = express();

app.set("view engine", "ejs");
app.set("views", "src/templates");

app.use("/", express.static( "public"));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

const api = express.Router();
app.use("/api", api);

api.use("/login", login);
api.use("/signup", signup);

app.listen(process.env.PORT ?? 3000, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
})