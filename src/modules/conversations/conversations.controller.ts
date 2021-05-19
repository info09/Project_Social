import { NextFunction, Request, Response } from "express";
import { SendMessageDto } from ".";
import ConversationService from "./conversations.service";

class ConversationController {
  private conversationService = new ConversationService();
  public sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: SendMessageDto = req.body;
      const userId = req.user.id;
      const result = await this.conversationService.sendMessage(userId, model);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default ConversationController;
