import * as yup from 'yup';

export const createCartItemSchema = yup.object({
  idCart: yup
    .number()
    .typeError('El id del carrito tiene que ser un numero')
    .integer('El id del carrito tiene que ser un numero entero')
    .required('El id del carrito es obligatorio'),

  idProducto: yup
    .number()
    .typeError('El id del producto tiene que ser un numero')
    .integer('El id del producto tiene que ser un numero entero')
    .required('El id del producto es obligatorio'),

  cantidad: yup
    .number()
    .integer('La cantidad tiene que ser un numero entero')
    .min(1, 'La cantidad minima es 1')
    .required('La cantidad es obligatoria'),

  precioUnitario: yup
    .number()
    .typeError('El precio tiene que ser un numero')
    .min(0.01, 'El precio tiene que ser mayor a 0')
    .required('El precio es obligatorio'),
});

export type CreateCartItemDto = yup.InferType<typeof createCartItemSchema>;
