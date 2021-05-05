import { HttpException } from "@core/exceptions";
import { isEmptyObject } from "@core/utils";
import { DataStoreInToken, TokenData } from "@modules/auth";
import RegisterDto from "./dtos/register.dto";
import UserSchema from "./user.model";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import IUser from "./user.interface";
import jwt from "jsonwebtoken";
class UserService {
  public userSchema = UserSchema;

  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = this.userSchema.findOne({ email: model.email });
    if (user) {
      throw new HttpException(409, `Email ${model.email} đã tồn tại`);
    }

    const avatar = gravatar.url(model.email!, {
      size: "200",
      rating: "g",
      default: "mm",
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = bcryptjs.hash(model.password!, salt);
    const createdUser: IUser = await this.userSchema.create({
      ...model,
      password: hashedPassword,
      avatar: avatar,
      date: Date.now(),
    });
    return this.createToken(createdUser);
  }

  private createToken(user: IUser): TokenData {
    const dataInToken: DataStoreInToken = { id: user._id };
    const secret: string = process.env.JWT_TOKEN!;
    const expiresIn: number = 60;
    return {
      token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    };
  }
}

export default UserService;
