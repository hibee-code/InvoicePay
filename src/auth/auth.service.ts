import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { EmailService } from '../email.service';
import { OtpService } from '../otp.service';
import { JwtService } from '../jwt.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }],
    });
    if (existing) throw new BadRequestException('User already exists');
    const hashed = await bcrypt.hash(dto.password, 10);
    const otp = this.otpService.generateOtp();
    const user = this.userRepository.create({
      email: dto.email,
      phone: dto.phone,
      password: hashed,
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });
    await this.userRepository.save(user);
    await this.otpService.sendOtp(dto.phone, otp);
    await this.emailService.sendEmail(dto.email, 'Verify your account', `Your OTP is: ${otp}`);
    return { success: true, message: 'Registration successful. OTP sent.' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isEmailVerified && !user.isPhoneVerified) {
      throw new UnauthorizedException('Account not verified');
    }
    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { success: true, token };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepository.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.otp || user.otp !== dto.otp) throw new BadRequestException('Invalid OTP');
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new BadRequestException('OTP expired');
    user.isEmailVerified = !!dto.email || user.isEmailVerified;
    user.isPhoneVerified = !!dto.phone || user.isPhoneVerified;
    user.otp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);
    return { success: true, message: 'OTP verified. Account activated.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.otp || user.otp !== dto.otp) throw new BadRequestException('Invalid OTP');
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new BadRequestException('OTP expired');
    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.otp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);
    return { success: true, message: 'Password reset successful.' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');
    // For demo, treat token as OTP
    if (!user.otp || user.otp !== dto.token) throw new BadRequestException('Invalid token');
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) throw new BadRequestException('Token expired');
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);
    return { success: true, message: 'Email verified.' };
  }
} 