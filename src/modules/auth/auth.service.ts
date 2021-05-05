import { HttpException } from "@core/exceptions";
import { isEmptyObject } from "@core/utils";
import { DataStoreInToken, TokenData } from ".";
import LoginDto from "./auth.dtos";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { IUser, UserSchema } from "@modules/users";

class AuthService {
  public userSchema = UserSchema;

  public async login(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({ email: model.email });
    if (!user) {
      throw new HttpException(409, `Tài khoản hoặc mật khẩu không đúng`);
    }

    const isMatchPass = await bcryptjs.compare(model.password, user.password);

    if (!isMatchPass) {
      throw new HttpException(400, "Tài khoản hoặc mật khẩu không đúng");
    }

    return this.createToken(user);
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

export default AuthService;
