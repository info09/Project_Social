import { HttpException } from "@core/exceptions";
import { IUser, UserSchema } from "@modules/users";
import {
  CreateGroupDto,
  GroupSchema,
  IGroup,
  IManager,
  IMember,
  SetManagerDto,
} from ".";

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

  public async joinGroup(userId: string, groupId: string) {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) {
      throw new HttpException(400, "Group not found");
    }

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    if (
      group.member_requests &&
      group.member_requests.some(
        (item: IMember) => item.user.toString() === userId
      )
    ) {
      throw new HttpException(400, "User đã request join nhóm");
    }

    if (
      group.members &&
      group.members.some((item: IMember) => item.user === userId)
    ) {
      throw new HttpException(400, "User đã join nhóm");
    }

    group.member_requests.unshift({ user: userId } as IMember);
    await group.save();
    return group;
  }

  public async approvedJoinGroup(userId: string, groupId: string) {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) {
      throw new HttpException(400, "Group not found");
    }

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    if (
      group.members &&
      group.members.some((item: IMember) => item.user === userId)
    ) {
      throw new HttpException(400, "User đã join nhóm");
    }

    if (
      group.member_requests &&
      group.member_requests.some(
        (item: IMember) => item.user.toString() !== userId
      )
    ) {
      throw new HttpException(400, "User chưa request join nhóm");
    }

    group.member_requests = group.member_requests.filter(
      ({ user }) => user.toString() !== userId
    );

    group.members.unshift({ user: userId } as IMember);

    await group.save();
    return group;
  }

  public async removeMemberGroup(userId: string, groupId: string) {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) {
      throw new HttpException(400, "Group not found");
    }

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    if (
      group.members &&
      group.members.some((member: IMember) => member.user.toString() !== userId)
    ) {
      throw new HttpException(400, "User chưa phải là thành viên của group");
    }

    group.members = group.members.filter(
      ({ user }) => user.toString() !== userId
    );
    await group.save();
    return group;
  }

  public async addManager(
    groupId: string,
    request: SetManagerDto
  ): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is not exist");

    const user = await UserSchema.findById(request.userId)
      .select("-password")
      .exec();
    if (!user) throw new HttpException(400, "User id is not exist");

    // if (
    //   group.members &&
    //   group.members.some(
    //     (member: IMember) => member.user.toString() !== request.userId
    //   )
    // ) {
    //   throw new HttpException(400, "User chưa phải làm member của group");
    // }

    if (
      group.managers &&
      group.managers.some(
        (item: IManager) => item.user.toString() === request.userId
      )
    ) {
      throw new HttpException(
        400,
        "You has already been set manger to this group"
      );
    }

    group.managers.unshift({
      user: request.userId,
      role: request.role,
    } as IManager);

    await group.save();
    return group;
  }

  public async removeManager(userId: string, groupId: string): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) {
      throw new HttpException(400, "Group not found");
    }

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) {
      throw new HttpException(400, "User not found");
    }

    if (
      group.members &&
      group.members.some((member) => member.user.toString() !== userId)
    ) {
      throw new HttpException(400, "User not yet member in group");
    }

    if (
      group.managers &&
      group.managers.some(
        (manager: IManager) => manager.user.toString() !== userId
      )
    ) {
      throw new HttpException(400, "User not yet manager this group");
    }

    group.managers = group.managers.filter(
      ({ user }) => user.toString() !== userId
    );
    await group.save();
    return group;
  }

  public async getAllMember(groupId: string): Promise<IUser[]> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) {
      throw new HttpException(400, "Group not found");
    }

    const userIds = await group.members.map((member) => {
      return member.user;
    });

    const users = await UserSchema.find({ _id: userIds })
      .select("-password")
      .exec();

    return users;
  }
}

export default GroupService;
