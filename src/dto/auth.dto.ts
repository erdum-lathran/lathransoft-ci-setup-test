import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsInt, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/enum';

export class UpdateProfile {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
  
  @ApiProperty({
    description: 'The first name of the user',
    example: 'jhon',
  })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  

  @ApiProperty({
    description: 'The last name of the user',
    example: 'doe',
  })
  @IsString({ message: 'First name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+911234567890',
  })
  @IsString({ message: 'phone number must be a string' })
  phoneNumber: string;
 
  @ApiProperty({
    description: 'tenant id',
    example: 1,
  })
  @IsInt({ message: 'tenant id must be a number' })
  tenantId: number;

  @ApiProperty({
    description: 'The role of the user',
    example: UserRole.ADMIN,
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of the following: Manager, Associate, Client Admin' })
  role: UserRole;
}

export class RegisterWithSSODTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
    required: true, // Mark as optional in the Swagger docs
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'jhon',
    required: false, // Mark as optional in the Swagger docs
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'doe',
    required: false, // Mark as optional in the Swagger docs
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+911234567890',
    required: false, // Mark as optional in the Swagger docs
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Tenant ID',
    example: 1,
    required: false, // Mark as optional in the Swagger docs
  })
  @IsOptional()
  @IsInt({ message: 'Tenant ID must be a number' })
  tenantId?: number;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Admin@123',
    required: false, // Mark as optional in the Swagger docs
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password is too short. It must be at least 6 characters long',
  })
  password?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: UserRole.ADMIN,
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of the following: Manager, Associate, Client Admin' })
  role: UserRole;

  @ApiProperty({
    description: 'The status of the user',
    example: true,
  })
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    description: 'Profile image URL or base64-encoded string',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
    required: false, 
  })
  @IsOptional()
  @IsString({ message: 'Profile image must be a string' })
  profileImage?: string; 
}

export class LoginDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Admin@123',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password is too short. It must be at least 6 characters long',
  })
  password: string;
}

export class RegisterDTO extends UpdateProfile {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Admin@123',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password is too short. It must be at least 6 characters long',
  })
  password: string;
}

export class VerifyOtpDTO {
  @ApiProperty({
    description: 'The otp of the user',
    example: '0568',
  })
  @MinLength(6, {
    message: 'Otp must be at least 6 number',
  })
  otp: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}

export class ChnagePasswordDTO {
  @ApiProperty({
    description: 'The password of the user',
    example: 'Admin@123',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password is too short. It must be at least 6 characters long',
  })
  oldPassword: string;

  @ApiProperty({
    description: 'The new password of the user',
    example: 'Admin@123',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password is too short. It must be at least 6 characters long',
  })
  newPassword: string;
}

export class ResetPasswordDTO extends ChnagePasswordDTO {
  @ApiProperty({
    description: 'The new password of the user',
    example: 'Admin@123',
  })
  token: string;
}
