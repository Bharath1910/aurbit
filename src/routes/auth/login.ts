import { Router } from "express";

const login = Router();

login.get("/", (req, res) => {
	res.header("Cache-Control", "max-age=604800")
	res.render("auth/login");
})

export default login;