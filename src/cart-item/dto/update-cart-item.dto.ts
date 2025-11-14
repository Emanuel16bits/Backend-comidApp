import * as yup from 'yup';

export const updateCartItemSchema = yup.object({
  idCart: yup
    .number()
    .typeError('El id del carrito tiene que ser un numero')
    .integer('El id del carrito tiene que ser un numero entero')
    .notRequired(),

  idProducto: yup
    .number()
    .typeError('El id del producto tiene que ser un numero')
    .integer('El id del producto tiene que ser un numero entero')
    .notRequired(),
  cantidad: yup
    .number()
    .typeError('La cantidad tiene que ser un numero')
    .integer('La cantidad tiene que ser un numero entero')
    .min(1, 'La cantidad minima es 1')
    .notRequired(),

  precioUnitario: yup
    .number()
    .typeError('El precio tiene que ser un numero')
    .min(0.01, 'El precio tiene que ser mayor a 0')
    .notRequired(),
});

export type UpdateCartItemDto = yup.InferType<typeof updateCartItemSchema>;
