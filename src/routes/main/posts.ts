import { Request, Response, Router } from "express";
import { authForgiving } from "../../middlewares/auth";
import { db } from "../../db/database";
import { StatusCodes } from "http-status-codes";

const posts = Router();

posts.use(authForgiving);
posts.get("/", async(req, res) => {
	// if (res.locals.authenticated) {
	// 	res.render("home/post");
	// 	return;
	// }

	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

	const posts = await db
		.selectFrom('posts')
		.select(['id', 'title', 'content', 'votes'])
		.orderBy(['created_at', 'id'])
		.limit(limit)
		.offset((page - 1) * limit)
		.execute();

	res.locals.posts = posts;
	res.render("home/post");
})

posts.get("/:id/comments", async (req, res ) => {
	if (!req.params.id) {
		res.status(StatusCodes.BAD_REQUEST).send("the field id is required");
		return;
	}

	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

	const comments = await db
		.selectFrom('comments')
		.where('post_id', '=', req.params.id)
		.where('parent_id', 'is', null)
		.select(['id', 'content', 'author', 'post_id'])
		.orderBy('id')
		.limit(limit)
		.offset((page - 1) * limit)
		.execute();

	res.locals.comments = comments;
	res.render("home/comment");
});

posts.post("/:id/comments", async (req, res ) => {
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
			post_id: req.params.id
		})
		.returningAll()
		.execute();

	res.locals.comments = comments;
	res.render("home/comment");
});

posts.post("/", async(req: Request, res: Response) => {
	if (!req.body.community || !req.body.title || !req.body.content) {
		res.header("HX-Retarget", "#error");
		res.status(StatusCodes.BAD_REQUEST).send("the fields community, title and content are required");
		return;
	}

	try {
		const post = await db
			.insertInto('posts')
			.values({
				community_id: req.body.community,
				title: req.body.title,
				content: req.body.content,
				username: res.locals.username,
			})
			.returning('id')
			.executeTakeFirst();

		res.header("HX-Redirect", `/posts/${post?.id}`);
		res.status(StatusCodes.CREATED).send();
		return;
	} catch (err: any) {
		if (err.code === '23503') {
			res.header("HX-Retarget", "#error");
			res.status(StatusCodes.NOT_FOUND).send("Community not found");
			return;
		}

		console.log(err);
		res.header("HX-Retarget", "#error");
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred, please try again later");
		return;
	}
});

posts.post("/:id/:interactionType", async (req, res) => {
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
			.insertInto('post_interactions')
			.values({
				post_id: req.params.id,
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
			.selectFrom('post_interactions')
			.select(['type'])
			.where('post_id', '=', req.params.id)
			.where('user_id', '=', res.locals.username)
			.executeTakeFirst();

		if (interaction?.type === interactionType) {
			await db
				.deleteFrom('post_interactions')
				.where('post_id', '=', req.params.id)
				.where('user_id', '=', res.locals.username)
				.execute();
		} else {
			await db
				.updateTable('post_interactions')
				.set('type', interactionType)
				.where('post_id', '=', req.params.id)
				.where('user_id', '=', res.locals.username)
				.execute();
		}
	}

	return res.status(StatusCodes.OK).send("success");
});

export default posts;