import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const signup = Router();

signup.get("/", (req, res) => {
	res.header("Cache-Control", "max-age=604800")
	res.render("auth/signup");
})

signup.post("/", (req, res) => {
	console.log(req.body)
	if (req.body.username === '' || req.body.password === '') {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/signup")
		res.status(StatusCodes.BAD_REQUEST).send("username and password are required");
		return;
	}

	if (req.body.password !== req.body.confirm_password) {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/signup")
		res.status(StatusCodes.BAD_REQUEST).send("Passwords do not match");
		return;
	}

	// Save the user to the database
});

export default signup;