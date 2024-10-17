import { Request, Response } from "express";
import dotnenv from 'dotenv';
import { FormDataType } from "src/types/types";
import { getTemplate, sendMail } from "./actions";
dotnenv.config()

export const handleSendMail = async (req: Request<{}, {}, FormDataType>, res: Response) => {
  // TODO: handle errors
  if (req.file) {
    const tempalate = getTemplate(req.body, req.file.path);
    const info = await sendMail(tempalate);
    console.log("Message sent: %s", info?.messageId);
    res.json({ success: true });
  }
  if (!req.file) {
    const tempalate = getTemplate(req.body, "");
    const info = await sendMail(tempalate);
    console.log("Message sent: %s", info?.messageId);
    res.json({ success: true });
  }
}
