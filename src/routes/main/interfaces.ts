import { Request, Response, Router } from "express";
import { authForgiving } from "../../middlewares/auth";

const interfaces = Router();

interfaces.use(authForgiving);
interfaces.get("/navbar", (req, res) => {
	res.render("interfaces/navbar");
})

interfaces.get("/sidebar", (req, res) => {
	res.render("interfaces/sidebar");
})
export default interfaces;
