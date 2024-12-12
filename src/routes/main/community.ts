import { Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { db } from "../../db/database";
import { StatusCodes } from "http-status-codes";

const community = Router();

community.use(auth);
community.post("/new", async(req, res) => {
	if (!req.body.name || !req.body.description) {
		res.header("HX-Retarget", "#error");
		res.status(StatusCodes.BAD_REQUEST).send("name and description are required");
		return;
	}

	try {
		await db.insertInto('communities')
			.values({
				name: req.body.name,
				description: req.body.description,
				owner: res.locals.username,
			})
			.execute();
		
		res.header("HX-Redirect", "/");
		res.status(StatusCodes.CREATED).send();
		return;
	} catch (err: any) {
		if (err.code === '23505') {
			res.header("HX-Retarget", "#error");
			res.status(StatusCodes.CONFLICT).send("Community already exists");
			return
		}
		console.log(err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
		return;
	}
})

export default community;