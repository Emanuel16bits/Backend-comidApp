import * as yup from 'yup';

export const updateUserSchema = yup.object({
  nombre: yup.string().max(100).optional(),
  email: yup.string().email('Email invalido').optional(),
  password: yup.string().min(6).optional(),
  rol: yup.string().oneOf(['cliente', 'repartidor', 'vendedor']).optional(),
});

export type UpdateUserDto = yup.InferType<typeof updateUserSchema>;
