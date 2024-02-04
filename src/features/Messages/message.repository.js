import MessageModel from "./message.schema.js";

export const getMessagesRepo = async (senderID, receiverID) => {
  try {
    // Find the document that contains both senderID and receiverID
    const resp = await MessageModel.findOne({
      participants: { $all: [senderID, receiverID] },
    });

    if (resp) {
      // If the document is found, return the messages array
      return { success: true, messages: resp.messages || [] };
    } else {
      // If the document is not found, return an empty array
      return { success: true, messages: [] };
    }
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error.message } };
  }
};
