import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email('Email invalido').required('Email es obligatorio'),
  password: yup.string().required('Contraseña es obligatoria'),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    await loginSchema.validate(loginDto, { abortEarly: false });

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Datos invalidos');
    }

    return this.authService.login(user);
  }
}
