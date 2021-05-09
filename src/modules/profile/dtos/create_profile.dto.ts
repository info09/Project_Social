export default class CreateProfileDto {
  constructor(
    company: string,
    location: string,
    website: string,
    bio: string,
    skill: string,
    status: string,
    youtube: string,
    twitter: string,
    instagram: string,
    facebook: string
  ) {
    this.company = company;
    this.location = location;
    this.website = website;
    this.bio = bio;
    this.skill = skill;
    this.status = status;
    this.youtube = youtube;
    this.twitter = twitter;
    this.instagram = instagram;
    this.facebook = facebook;
  }

  public company: string;
  public location: string;
  public website: string;
  public bio: string;
  public skill: string;
  public status: string;
  public youtube: string;
  public twitter: string;
  public instagram: string;
  public facebook: string;
}
