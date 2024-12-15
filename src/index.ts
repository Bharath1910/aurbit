import { config } from "dotenv";
config();
import express from "express";
import login from "./routes/auth/login";
import signup from "./routes/auth/signup";
import interfaces from "./routes/main/interfaces";
import cookieParser from "cookie-parser";
import posts from "./routes/main/posts";
import community from "./routes/main/community";
import detailedPosts from "./routes/detailed/posts";
import { authForgiving } from "./middlewares/auth";
import comments from "./routes/main/comments";

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/templates");

app.use(cookieParser());
app.use("/", express.static( "public"));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.get("/posts/:id", authForgiving,(req, res) => detailedPosts(req, res));

const api = express.Router();
app.use("/api", api);

api.use("/login", login);
api.use("/signup", signup);
api.use("/interfaces", interfaces);
api.use("/posts", posts);
api.use("/community", community);
api.use("/comments", comments);

const port = parseInt(process.env.PORT ?? "3000");
const hostName = process.env.HOST ?? "localhost";

app.listen(port, hostName,() => {
	console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
})