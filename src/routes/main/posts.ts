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

	const posts = await db
		.selectFrom('posts')
		.select(['id', 'title', 'content', 'votes'])
		.execute();

	res.locals.posts = posts;
	res.render("home/post");
})

posts.get("/:id/comments", async (req, res ) => {
	if (!req.params.id) {
		res.status(StatusCodes.BAD_REQUEST).send("the field id is required");
		return;
	}

	const comments = await db
		.selectFrom('comments')
		.where('post_id', '=', req.params.id)
		.where('parent_id', 'is', null)
		.select(['id', 'content', 'author'])
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

export default posts;