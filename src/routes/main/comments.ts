import { Request, Response, Router } from "express";
import { authForgiving } from "../../middlewares/auth";
import { db } from "../../db/database";
import { StatusCodes } from "http-status-codes";

const comments = Router();

comments.use(authForgiving);
comments.get("/:id/replies", async(req, res) => {
	if (!req.params.id) {
		res.status(StatusCodes.BAD_REQUEST).send("post id is required");
		return;
	}

	try {
		const replies = await db
			.selectFrom('comments')
			.where('parent_id', '=', req.params.id)
			.select(['id', 'content', 'author'])
			.execute();

		res.locals.comments = replies;
		res.render("home/comment");
		return;
	} catch (err: any) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
		return;
	}
})

export default comments;