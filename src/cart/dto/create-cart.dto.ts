import * as yup from 'yup';

export const createCartSchema = yup.object({
  usuarioId: yup
    .number()
    .typeError('El id tiene que ser un numero')
    .integer('El id tiene que ser un numero entero')
    .required('El id es obligatorio'),
});

export type CreateCartDto = yup.InferType<typeof createCartSchema>;
