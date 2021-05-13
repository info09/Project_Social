import { HttpException } from "@core/exceptions";
import { IUser, UserSchema } from "@modules/users";
import normalizeUrl from "normalize-url";
import { IProfile, ISocial, ProfileSchema } from ".";
import AddEducationDto from "./dtos/add_education.dto";
import AddExperienceDto from "./dtos/add_experience.dto";
import CreateProfileDto from "./dtos/create_profile.dto";
import { IEducation, IExperience, IFollow } from "./profile.interface";

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

  public addExperience = async (
    userId: string,
    experience: AddExperienceDto
  ) => {
    const newExp = {
      ...experience,
    };

    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(400, "No profile this user");
    }

    profile.experience.unshift(newExp as IExperience);
    await profile.save();
    return profile;
  };

  public deleteExperience = async (userId: string, experienceId: string) => {
    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(400, "No profile this user");
    }

    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== experienceId
    );
    await profile.save();
    return profile;
  };

  public addEducation = async (userId: string, education: AddEducationDto) => {
    const newEdu = {
      ...education,
    };

    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(400, "No profile this user");
    }

    profile.education.unshift(newEdu as IEducation);
    await profile.save();
    return profile;
  };

  public deleteEducation = async (userId: string, experienceId: string) => {
    const profile = await ProfileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(400, "No profile this user");
    }

    profile.education = profile.education.filter(
      (exp) => exp._id.toString() !== experienceId
    );
    await profile.save();
    return profile;
  };

  public follow = async (formUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: formUserId,
    }).exec();
    if (!fromProfile) {
      throw new HttpException(400, "From User not found");
    }

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();
    if (!toProfile) {
      throw new HttpException(400, "To user not found");
    }

    if (
      toProfile.followers &&
      toProfile.followers.some(
        (follower: IFollow) => follower.user.toString() === formUserId
      )
    ) {
      throw new HttpException(
        400,
        `User ${formUserId} đã theo dõi user ${toUserId}`
      );
    }

    if (
      fromProfile.followings &&
      fromProfile.followings.some(
        (follow: IFollow) => follow.user.toString() === toUserId
      )
    ) {
      throw new HttpException(
        400,
        `User ${toUserId} đã được theo dõi bởi user ${formUserId}`
      );
    }

    if (!fromProfile.followings) {
      fromProfile.followings = [];
    }
    fromProfile.followings.unshift({ user: toUserId });

    if (!toProfile.followers) {
      toProfile.followers = [];
    }
    toProfile.followers.unshift({ user: formUserId });

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };

  public unFollow = async (fromUserId: string, toUserId: string) => {
    const fromProfile = await ProfileSchema.findOne({
      user: fromUserId,
    }).exec();
    if (!fromProfile) {
      throw new HttpException(400, `From User not found`);
    }

    const toProfile = await ProfileSchema.findOne({ user: toUserId }).exec();
    if (!toProfile) {
      throw new HttpException(400, "To User not found");
    }

    if (
      fromProfile.followings &&
      fromProfile.followings.some(
        (follow: IFollow) => follow.user.toString() !== toUserId
      )
    ) {
      throw new HttpException(400, `Bạn chưa follow user ${toUserId}`);
    }

    if (
      toProfile.followers &&
      toProfile.followers.some(
        (follow: IFollow) => follow.user.toString() !== fromUserId
      )
    ) {
      throw new HttpException(
        400,
        `Bạn chưa được theo dõi từ User ${fromUserId}`
      );
    }

    if (!fromProfile.followings) {
      fromProfile.followings = [];
    }
    fromProfile.followings = fromProfile.followings.filter(
      ({ user }) => user.toString() !== toUserId
    );

    if (!toProfile.followers) {
      toProfile.followers = [];
    }
    toProfile.followers = toProfile.followers.filter(
      ({ user }) => user.toString() !== fromUserId
    );

    await fromProfile.save();
    await toProfile.save();

    return fromProfile;
  };
}

export default ProfileService;
