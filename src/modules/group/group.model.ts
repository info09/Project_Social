import mongoose, { Document } from "mongoose";
import IGroup from "./group.interface";

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  managers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      role: {
        type: String,
        enum: ["admin", "mod"],
        default: "admin",
      },
    },
  ],
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  member_requests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model<IGroup & Document>("group", GroupSchema);
