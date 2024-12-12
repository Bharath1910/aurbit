import { Router } from "express";
import bcrypt from 'bcrypt';
import { db } from "../../db/database";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";

const login = Router();

login.get("/", (req, res) => {
	res.header("Cache-Control", "max-age=604800");
	res.render("auth/login");
})

login.post("/", async (req, res) => {
	if (req.body.username === '' || req.body.password === '') {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.BAD_REQUEST).send("username and password are required");
		return;
	}

	const user = await db
		.selectFrom('users')
		.where('username', '=', req.body.username)
		.select(['password'])
		.executeTakeFirst();

	if (user === undefined) {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.BAD_REQUEST).send("User does not exist");
		return;
	}

	const passwordMatch = await bcrypt.compare(req.body.password, user.password);
	if (!passwordMatch) {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.FORBIDDEN).send("Incorrect password");
		return;
	}

	const token = jwt.sign(
		{username: req.body.username}, 
		process.env.JWT_SECRET as string,
	);

	res.cookie('token', token, {
		sameSite: 'strict',
		httpOnly: true,
	});
	res.header("HX-Redirect", "/")
	res.status(StatusCodes.NO_CONTENT).send();
});

export default login;