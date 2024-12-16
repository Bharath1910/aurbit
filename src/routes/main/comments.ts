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

comments.post("/:id/replies", async (req, res ) => {
	if (!res.locals.authenticated) {
		res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
		return;
	}

	if (!req.params.id || !req.body.content) {
		res.status(StatusCodes.BAD_REQUEST).send("the field id is required");
		return;
	}

	const comments = await db
		.insertInto('comments')
		.values({
			author: res.locals.username,
			content: req.body.content,
			post_id: req.body.postId,
			parent_id: req.params.id
		})
		.returningAll()
		.execute();

	res.locals.comments = comments;
	res.render("home/comment");
});

export default comments;