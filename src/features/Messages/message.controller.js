import { customErrorHandler } from "../../utils/errorHandler.js";

export const userMessages = async (req, res, next) => {
  const resp = await getMessagesRepo(senderID, receiverID);
  if (resp.success) {
    res.status(201).json({
      success: true,
      messages: resp.messages,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};
