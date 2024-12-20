import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export default async function auth(req: Request, res: Response, next: NextFunction) {
	if (req.cookies.token === undefined) {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
		return;
	}

	const token = req.cookies.token;
	const secret = process.env.JWT_SECRET
	if (!secret) {
		console.error("JWT_SECRET not set")
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
		return;
	}

	try {
		const decoded = jwt.verify(token, secret) as { username: string };
		res.locals.authenticated = true;
		res.locals.username = decoded.username;
	} catch (error) {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
		return;
	}

	next();
}

export async function authForgiving(req: Request, res: Response, next: NextFunction) {
	if (!req.cookies.token) {
		res.locals.authenticated = false;
		next();
		return;
	}

	const token = req.cookies.token;
	const secret = process.env.JWT_SECRET
	if (!secret) {
		console.error("JWT_SECRET not set")
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
		return;
	}

	try {
		const decoded = jwt.verify(token, secret) as { username: string };
		res.locals.authenticated = true;
		res.locals.username = decoded.username;
	} catch (error) {
		res.header("HX-Retarget", "#error")
		res.header("HX-Replace-Url", "/login")
		res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
		return;
	}

	next();
}