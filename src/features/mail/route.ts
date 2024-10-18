import { Router } from "express";
import { isAuth } from "../auth/controller";
import { handleSendMail } from "./controller";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files


export const mailRouter = Router();

mailRouter.post("/", isAuth, upload.single('resume'), handleSendMail);

export default mailRouter;
