export default interface IProfile {
  _id: string;
  user: string;
  company: string;
  website: string;
  location: string;
  status: string;
  skill: string[];
  bio: string;
  experience: IExperience[];
  education: IEducation[];
  social: ISocial;
  date: Date;
}

export interface IExperience {
  _id: string;
  title: string;
  company: string;
  location: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}

export interface IEducation {
  _id: string;
  school: string;
  degree: string;
  field_of_study: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}

export interface ISocial extends Record<string, string> {
  youtube: string;
  facebook: string;
  twitter: string;
  instagram: string;
}
