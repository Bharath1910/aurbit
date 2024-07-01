import { Router } from "express";

const login = Router();

login.get("/", (req, res) => {
	res.render("auth/login");
})

export default login;