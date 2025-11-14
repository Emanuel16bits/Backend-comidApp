import * as yup from 'yup';
export const createProductSchema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
  precio: yup.number().required('El precio es obligatorio'),
  descripcion: yup.string().required('La descripción es obligatoria'),
  stock: yup.number().required('El stock es obligatorio'),
  imagen: yup.string().optional(),
  restaurantId: yup.number().required('El id del restaurante es obligatorio'),
  userId: yup.number().required('El id del usuario es obligatorio'),
});

export type CreateProductDto = yup.InferType<typeof createProductSchema>;
