import { Router } from "express";
import { isAuth } from "../auth/controller";
import { handleSendMail } from "./controller";

export const mailRouter = Router();

mailRouter.post("/", isAuth, handleSendMail);

export default mailRouter;
