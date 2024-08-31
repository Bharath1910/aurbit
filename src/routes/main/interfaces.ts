import { Request, Response, Router } from "express";
import bcrypt from 'bcrypt';
import { db } from "../../db/database";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { authForgiving } from "../../middlewares/auth";
import { STATUS_CODES } from "http";

const interfaces = Router();

interfaces.use(authForgiving);
interfaces.get("/navbar", (req, res) => {
	console.log(res.locals)
	res.render("interfaces/navbar");
})

export default interfaces;