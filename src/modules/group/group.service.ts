import { HttpException } from "@core/exceptions";
import { UserSchema } from "@modules/users";
import { CreateGroupDto, GroupSchema, IGroup } from ".";

class GroupService {
  public async createGroup(
    userId: string,
    groupDto: CreateGroupDto
  ): Promise<IGroup> {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) {
      throw new HttpException(400, "User not found");
    }

    const existingGroup = await GroupSchema.find({
      $or: [{ name: groupDto.name }, { code: groupDto.code }],
    }).exec();
    if (existingGroup.length > 0) {
      throw new HttpException(400, "Name or code is exist");
    }

    const newGroup = new GroupSchema({
      ...groupDto,
      creator: userId,
    });
    const group = await newGroup.save();
    return group;
  }

  public async getAllGroup(): Promise<IGroup[]> {
    const group = await GroupSchema.find().exec();
    return group;
  }

  public async updateGroup(
    userId: string,
    groupId: string,
    groupDto: CreateGroupDto
  ): Promise<IGroup> {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) {
      throw new HttpException(400, "User not found");
    }

    const group = await GroupSchema.findById(groupId).exec();
    if (!group) {
      throw new HttpException(400, "Group not found");
    }

    if (group.name != groupDto.name && group.code != groupDto.code) {
      const existingGroup = await GroupSchema.find({
        $or: [{ name: groupDto.name }, { code: groupDto.code }],
      }).exec();
      if (existingGroup.length > 0) {
        throw new HttpException(400, "Name or code is exist");
      }
    }

    const groupField: Partial<IGroup> = {
      ...groupDto,
      creator: userId,
    };

    const updateGroup = await GroupSchema.findOneAndUpdate(
      { creator: userId },
      { $set: groupField },
      { new: true }
    ).exec();

    if (!updateGroup) throw new HttpException(400, "Update is not success");

    return updateGroup;
  }

  public async deleteGroup(userId: string, groupId: string): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) {
      throw new HttpException(400, "Group not found");
    }

    if (userId != group.creator) {
      throw new HttpException(400, "User unAuthorize");
    }
    const deletedGroup = await GroupSchema.findOneAndDelete({
      _id: groupId,
    }).exec();
    if (!deletedGroup) throw new HttpException(400, "Update is not success");

    return deletedGroup;
  }
}

export default GroupService;
