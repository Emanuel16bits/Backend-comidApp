import * as yup from 'yup';

export const updateProductSchema = yup.object().shape({
  nombre: yup.string().required('El nombre tiene que ser obligatorio'),
  precio: yup.number().required('El precio tiene que ser obligatorio'),
  descripcion: yup
    .string()
    .required('La descripcion tiene que ser obligatoria'),
  stock: yup.number().required('El stock tiene que ser obligatorio'),
});

export type UpdateProductDto = yup.InferType<typeof updateProductSchema>;
