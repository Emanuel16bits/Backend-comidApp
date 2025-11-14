import * as yup from 'yup';

export const updateFavoriteSchema = yup.object({
  productoIdViejo: yup
    .number()
    .positive('El id del producto viejo tiene que ser un numero positivo')
    .integer('El id del producto viejo tiene que ser un numero entero')
    .optional(),

  productoIdNuevo: yup
    .number()
    .positive('El id del producto nuevo tiene que ser un numero positivo')
    .integer('El id del producto nuevo tiene que ser un numero entero')
    .optional(),
});

export type UpdateFavoriteDto = yup.InferType<typeof updateFavoriteSchema>;
