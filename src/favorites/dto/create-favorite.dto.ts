import * as yup from 'yup';

export const createFavoriteSchema = yup.object().shape({
  usuarioId: yup
    .number()
    .required('El id del usuario es obligatorio')
    .positive('El id del usuario tiene que ser un numero positivo')
    .integer('El id del usuario tiene que ser un numero entero'),

  productoId: yup
    .number()
    .required('El id del producto es obligatorio')
    .positive('El id del producto tiene que ser un numero positivo')
    .integer('El id del producto tiene que ser un numero entero'),
});

export type CrearFavoriteDto = yup.InferType<typeof createFavoriteSchema>;
