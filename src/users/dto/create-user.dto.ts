import * as yup from 'yup';

export const createUserSchema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio').min(2),
  email: yup
    .string()
    .email('Correo invalido')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .min(6, 'Minimo 6 caracteres')
    .required('La contraseña es obligatoria'),
  rol: yup
    .string()
    .oneOf(['cliente', 'vendedor', 'repartidor'])
    .default('cliente'),

  restaurante: yup.mixed().when('rol', {
    is: 'vendedor',
    then: () =>
      restauranteSchema.required(
        'Los datos del restaurante son obligatorios para vendedores',
      ),
    otherwise: () => yup.mixed().notRequired(),
  }),
});

const restauranteSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  direccion: yup.string().required('La dirección es obligatoria'),
  categoria: yup.string().required('La categoría es obligatoria'),
});

export type CreateUserDto = yup.InferType<typeof createUserSchema>;
