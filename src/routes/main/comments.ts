import { Request, Response, Router } from "express";
import { authForgiving } from "../../middlewares/auth";
import { db } from "../../db/database";
import { StatusCodes } from "http-status-codes";

const comments = Router();

comments.use(authForgiving);
comments.get("/:id/replies", async (req, res) => {
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

comments.post("/:id/:interactionType", async (req, res) => {
	if (!res.locals.authenticated) {
		res.status(StatusCodes.UNAUTHORIZED).send("Login to interact with comments");
		return;
	}

	if (!req.params.id || !req.params.interactionType) {
		res.status(StatusCodes.BAD_REQUEST).send("the field id is required");
		return;
	}

	const interactionType = req.params.interactionType.toUpperCase();
	if (interactionType !== "UPVOTE" && interactionType !== "DOWNVOTE") {
		res.status(StatusCodes.BAD_REQUEST).send("invalid interaction type");
		return;
	}

	try {
		await db
			.insertInto('comment_interactions')
			.values({
				comment_id: req.params.id,
				type: interactionType,
				user_id: res.locals.username
			})
			.execute();
	} catch (err: any) {
		if (err.code !== '23505') {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
			return;
		}

		const interaction = await db
			.selectFrom('comment_interactions')
			.select(['type'])
			.where('comment_id', '=', req.params.id)
			.where('user_id', '=', res.locals.username)
			.executeTakeFirst();

		if (interaction?.type === interactionType) {
			await db
				.deleteFrom('comment_interactions')
				.where('comment_id', '=', req.params.id)
				.where('user_id', '=', res.locals.username)
				.execute();
		} else {
			await db
				.updateTable('comment_interactions')
				.set('type', interactionType)
				.where('comment_id', '=', req.params.id)
				.where('user_id', '=', res.locals.username)
				.execute();
		}
	}

	return res.status(StatusCodes.OK).send("success");
});

export default comments;