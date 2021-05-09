import mongoose, { Document } from "mongoose";
import IProfile from "./profile.interface";

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    require: true,
  },
  skill: {
    type: [String],
    require: true,
  },
  bio: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        require: true,
      },
      company: {
        type: String,
        require: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        require: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        require: true,
      },
      degree: {
        type: String,
        require: true,
      },
      field_of_study: {
        type: String,
      },
      from: {
        type: Date,
        require: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IProfile & Document>("profile", ProfileSchema);
