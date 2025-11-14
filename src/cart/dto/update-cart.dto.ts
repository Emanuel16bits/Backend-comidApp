import * as yup from 'yup';

export const updateCartSchema = yup.object({
  total: yup
    .number()
    .typeError('El total tiene que ser un numero')
    .min(0, 'El total no puede ser negativo')
    .optional(),

  activo: yup
    .boolean()
    .typeError('El valor de activo debe ser verdadero o falso')
    .optional(),

  items: yup
    .array()
    .of(
      yup.object({
        productId: yup
          .number()
          .typeError('El productId tiene que ser un numero')
          .required('El productId es obligatorio'),
        quantity: yup
          .number()
          .integer('La cantidad tiene que ser un numero entero')
          .min(1, 'La cantidad minima es 1')
          .required('La cantidad es obligatoria'),
        price: yup
          .number()
          .typeError('El precio tiene que ser un numero')
          .min(0, 'El precio no puede ser negativo')
          .required('El precio es obligatorio'),
      }),
    )
    .optional(),
});

export type UpdateCartDto = yup.InferType<typeof updateCartSchema>;
