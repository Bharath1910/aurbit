import { Request, Response, Router } from "express";
import { db } from "../../db/database";
import { StatusCodes } from "http-status-codes";

export default async function (req: Request, res: Response) {
	const postId = req.params.id;

	if (!postId || typeof postId !== 'string') {
		console.log(postId);
		res.status(StatusCodes.BAD_REQUEST).send("the field id is required");
		return;
	}

	try {
		const posts = await db
			.selectFrom('posts')
			.select(['title', 'content', 'votes', 'id'])
			.where('id', '=', postId)
			.executeTakeFirstOrThrow();
			
		res.locals.data = posts;
		res.render("home/postdetailed");
		return;
	} catch (err: any) {
		if (err.code === '22P02') {
			res.status(StatusCodes.NOT_FOUND).send('not found')
			return;
		}

		console.log(err);
		return;
	}	
};