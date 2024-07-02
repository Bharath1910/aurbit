import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../../db/database";
import bcrypt from "bcrypt"

const signup = Router();

signup.get("/", (req, res) => {
	res.header("Cache-Control", "max-age=604800")
	res.render("auth/signup");
})

signup.post("/", async (req, res) => {
	console.log(req.body)
	if (req.body.username === '' || req.body.password === '') {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/signup")
		res.status(StatusCodes.BAD_REQUEST).send("username and password are required");
		return;
	}

	if (req.body.password !== req.body.re_password) {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/signup")
		res.status(StatusCodes.BAD_REQUEST).send("Passwords do not match");
		return;
	}

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		await db
			.insertInto('users')
			.values({
				username: req.body.username,
				password: hashedPassword,
			})
			.execute();
	} catch (err: any) {
		if (err.code === "23505") {
			res.header("HX-Retarget", "#error")
			res.header("HX-Replace-Url", "/signup")
			res.status(StatusCodes.CONFLICT).send("Username already exists");
			return;
		}
		console.log("Error inserting user")
		console.log(err)

		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/signup")
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error inserting user");
	}

	res.status(StatusCodes.CREATED).render("auth/login")
});

export default signup;