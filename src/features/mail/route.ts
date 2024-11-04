import { Router } from "express";
import { handleSendMail } from "./controller";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files

export const mailRouter = Router();

mailRouter.post("/", upload.single('resume'), handleSendMail);

export default mailRouter;
