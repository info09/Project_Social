export default class AddEducationDto {
  constructor(
    school: string,
    degree: string,
    field_of_study: string,
    from: Date,
    to: Date,
    current: boolean,
    description: string
  ) {
    this.current = current;
    this.school = school;
    this.degree = degree;
    this.from = from;
    this.to = to;
    this.description = description;
    this.field_of_study = field_of_study;
  }
  public school: string;
  public degree: string;
  public field_of_study: string;
  public from: Date;
  public to: Date;
  public current: boolean;
  public description: string;
}
