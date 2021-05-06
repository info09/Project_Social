import { HttpException } from "@core/exceptions";
import { isEmptyObject } from "@core/utils";
import { DataStoreInToken, TokenData } from "@modules/auth";
import RegisterDto from "./dtos/register.dto";
import UserSchema from "./user.model";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import IUser from "./user.interface";
import jwt from "jsonwebtoken";
import { IPagination } from "@core/interfaces";
class UserService {
  public userSchema = UserSchema;

  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({ email: model.email }).exec();
    if (user) {
      throw new HttpException(409, `Email ${model.email} đã tồn tại`);
    }

    const avatar = gravatar.url(model.email!, {
      size: "200",
      rating: "g",
      default: "mm",
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(model.password!, salt);
    const createdUser: IUser = await this.userSchema.create({
      ...model,
      password: hashedPassword,
      avatar: avatar,
      date: Date.now(),
    });
    return this.createToken(createdUser);
  }

  public async updateUser(userId: string, model: RegisterDto): Promise<IUser> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(400, `userId is not exist`);
    }

    let avatar = user.avatar;
    if (user.email === model.email) {
      throw new HttpException(400, "You must using the different email");
    } else {
      avatar = gravatar.url(model.email!, {
        size: "200",
        rating: "g",
        default: "mm",
      });
    }

    let updateUser;

    if (model.password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(model.password!, salt);
      updateUser = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          password: hashedPassword,
          avatar: avatar,
        })
        .exec();
    } else {
      updateUser = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          avatar: avatar,
        })
        .exec();
    }

    if (!updateUser) {
      throw new HttpException(409, "You are not user");
    }

    return updateUser;
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `Tài khoản không tồn tại`);
    }

    return user;
  }

  public async getAll(): Promise<IUser[]> {
    const users = await this.userSchema.find().exec();
    return users;
  }

  public async getAllPaging(
    keyword: string,
    page: number
  ): Promise<IPagination<IUser>> {
    const pageSize: number = Number(process.env.PAGE_SIZE || 10);
    let query = {};

    if (keyword) {
      query = {
        $or: [
          { email: keyword },
          { first_name: keyword },
          { last_name: keyword },
        ],
      };
    }

    const users = await this.userSchema
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalCount = await this.userSchema
      .find(query)
      .estimatedDocumentCount()
      .exec();

    return {
      total: totalCount,
      page: page,
      pageSize: pageSize,
      items: users,
    } as IPagination<IUser>;

    // const users = await this.userSchema
    //   .find()
    //   .skip((page - 1) * pageSize)
    //   .limit(pageSize)
    //   .exec();
    // return users;
  }

  public async deleteUser(userId: string): Promise<IUser> {
    const deletedUser = await this.userSchema.findByIdAndDelete(userId).exec();
    if (!deletedUser) throw new HttpException(409, "Your id is invalid");
    return deletedUser;
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
