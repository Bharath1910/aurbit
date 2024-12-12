import { Request, Response, Router } from "express";
import { authForgiving } from "../../middlewares/auth";
import { db } from "../../db/database";

const posts = Router();

posts.use(authForgiving);
posts.get("/", async(req, res) => {
	// if (res.locals.authenticated) {
	// 	res.render("home/post");
	// 	return;
	// }

	const posts = await db
		.selectFrom('posts')
		.select(['title', 'content', 'votes'])
		.execute();

	res.locals.posts = posts;
	res.render("home/post");
})

export default posts;