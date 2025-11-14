import * as yup from 'yup';
import { UserRole } from '../../users/entities/user.entity';

export const createDriverSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'Mínimo 2 letras'),

  email: yup
    .string()
    .email('Correo inválido')
    .required('El correo es obligatorio'),

  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),

  telefono: yup.string().optional(),
  tipoVehiculo: yup.string().optional(),
  placa: yup.string().optional(),
  marca: yup.string().optional(),
  modelo: yup.string().optional(),
  color: yup.string().optional(),
  anio: yup.number().optional(),
  disponible: yup.boolean().optional().default(true),
  calificacion: yup.number().min(0).max(5).optional().default(0),
  gananciasTotales: yup.number().min(0).optional().default(0),
});

export class CreateDriverDto {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  tipoVehiculo?: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  color?: string;
  anio?: number;
  disponible?: boolean;
  calificacion?: number;
  gananciasTotales?: number;
}

export interface CreateUserDto {
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
}

export type CreateDriverDtoType = yup.InferType<typeof createDriverSchema>;
