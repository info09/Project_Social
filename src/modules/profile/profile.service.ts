import { HttpException } from "@core/exceptions";
import { IUser, UserSchema } from "@modules/users";
import normalizeUrl from "normalize-url";
import { IProfile, ISocial, ProfileSchema } from ".";
import CreateProfileDto from "./dtos/create_profile.dto";

class ProfileService {
  public async getCurrentProfile(userId: string): Promise<Partial<IUser>> {
    const user = await ProfileSchema.findOne({
      user: userId,
    })
      .populate("user", ["email", "avatar"])
      .exec();
    if (!user) {
      throw new HttpException(400, "There is no profile for this user");
    }
    return user;
  }

  public async createProfile(
    userId: string,
    profileDto: CreateProfileDto
  ): Promise<IProfile> {
    const {
      company,
      location,
      website,
      bio,
      skill,
      status,
      youtube,
      twitter,
      instagram,
      facebook,
    } = profileDto;

    const profileField: Partial<IProfile> = {
      user: userId,
      company,
      location,
      website:
        website && website != ""
          ? normalizeUrl(website.toString(), { forceHttps: true })
          : "",
      bio,
      skill: Array.isArray(skill)
        ? skill
        : skill.split(",").map((skill: string) => " " + skill.trim()),
      status,
    };

    const socialField: ISocial = {
      youtube,
      twitter,
      instagram,
      facebook,
    };

    for (const [key, value] of Object.entries(socialField)) {
      if (value && value.length > 0) {
        socialField[key] = normalizeUrl(value, { forceHttps: true });
      }
    }

    profileField.social = socialField;

    const profile = await ProfileSchema.findOneAndUpdate(
      { user: userId },
      { $set: profileField },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return profile;
  }

  public async deleteProfile(userId: string) {
    await ProfileSchema.findOneAndRemove({ user: userId }).exec();

    await UserSchema.findOneAndRemove({ _id: userId }).exec();
  }

  public async getAllProfile(): Promise<Partial<IUser>[]> {
    const profile = await ProfileSchema.find()
      .populate("user", ["name", "avatar"])
      .exec();

    return profile;
  }
}

export default ProfileService;
