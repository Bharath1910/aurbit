import { Router } from "express";

const signup = Router();

signup.get("/", (req, res) => {
	res.render("auth/signup");
})

export default signup;