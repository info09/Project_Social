import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import { ConversationController, SendMessageDto } from ".";

export default class ConversationRoute implements Route {
  public path = "/api/Conversation";
  public router = Router();
  public conversationController = new ConversationController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(SendMessageDto, true),
      this.conversationController.sendMessage
    );

    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.conversationController.getMyConversation
    );
  }
}
