export default class AddExperienceDto {
  constructor(
    title: string,
    company: string,
    location: string,
    from: Date,
    to: Date,
    current: boolean,
    description: string
  ) {
    this.company = company;
    this.title = title;
    this.location = location;
    this.from = from;
    this.to = to;
    this.current = current;
    this.description = description;
  }

  public title: string;
  public company: string;
  public location: string;
  public from: Date;
  public to: Date;
  public current: boolean;
  public description: string;
}
