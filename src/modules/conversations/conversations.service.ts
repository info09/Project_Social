import { HttpException } from "@core/exceptions";
import { UserSchema } from "@modules/users";
import { IConversation, IMessage, SendMessageDto } from ".";
import ConversationSchema from "./conversations.model";

class ConversationService {
  public async sendMessage(
    userId: string,
    request: SendMessageDto
  ): Promise<IConversation> {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) {
      throw new HttpException(400, "User not found");
    }

    const toUser = await UserSchema.findById(request.to)
      .select("-password")
      .exec();

    if (!toUser) {
      throw new HttpException(400, "To User not found");
    }
    if (!request.conversationId) {
      let newConversation = await ConversationSchema.findOne({
        $or: [
          { $and: [{ user1: userId }, { user2: request.to }] },
          { $and: [{ user1: request.to }, { user2: userId }] },
        ],
      }).exec();

      if (newConversation) {
        newConversation.message.unshift({
          to: request.to,
          from: userId,
          text: request.text,
        } as IMessage);
      } else {
        newConversation = new ConversationSchema({
          user1: userId,
          user2: request.to,
          message: [
            {
              from: userId,
              to: request.to,
              text: request.text,
            },
          ],
        });
      }
      await newConversation.save();
      return newConversation;
    } else {
      const conversation = await ConversationSchema.findById(
        request.conversationId
      ).exec();
      if (!conversation) {
        throw new HttpException(400, "Conversation id not exist");
      }

      if (
        (conversation.user1 !== userId && conversation.user2 !== request.to) ||
        (conversation.user1 !== request.to && conversation.user2 !== userId)
      ) {
        throw new HttpException(400, "Conversation Id is not valid");
      }

      conversation.message.unshift({
        to: request.to,
        text: request.text,
        from: userId,
      } as IMessage);
      await conversation.save();
      return conversation;
    }
  }

  public async getMyConversation(userId: string): Promise<IConversation[]> {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) {
      throw new HttpException(400, "User not found");
    }

    const conversation = await ConversationSchema.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .sort({ recent_date: -1 })
      .exec();

    return conversation;
  }
}
export default ConversationService;
