import { customErrorHandler } from "../../utils/errorHandler.js";
import { getMessagesRepo } from "./message.repository.js";
export const userMessages = async (req, res, next) => {
  console.log('i am here')
  const {senderID,receiverID}=req.params;
  const resp = await getMessagesRepo(senderID, receiverID);
  if (resp.success) {
    res.status(200).json({
      success: true,
      messages: resp.messages,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};
