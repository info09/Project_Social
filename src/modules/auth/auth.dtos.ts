import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  min,
  MinLength,
} from "class-validator";
export default class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(8)
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
