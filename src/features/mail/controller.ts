import { Request, Response } from "express";
import dotnenv from 'dotenv';
import { FormDataType } from "src/types/types";
import { getTemplate, sendMail } from "./actions";
dotnenv.config()

export const handleSendMail = async (req: Request<{}, {}, FormDataType>, res: Response) => {

  if (req.file) {
    const tempalate = getTemplate(req.body, req.file.path);
    const data = await sendMail(tempalate);
    if (!data.status) {
      res.json({ success: false });
      return
    }
    else {
      console.log("Message sent: %s", data.data?.messageId);
      res.json({ success: true });
    }
  }
  if (!req.file) {
    const tempalate = getTemplate(req.body, "");
    const data = await sendMail(tempalate);
    if (!data.status) {
      res.json({ success: false });
      return
    }
    else {
      console.log("Message sent: %s", data.data?.messageId);
      res.json({ success: true });
    }
  }
}
