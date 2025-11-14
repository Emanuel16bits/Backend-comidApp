import * as yup from 'yup';

export const createRestaurantSchema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
  direccion: yup.string().required('La dirección es obligatoria'),
  categoria: yup.string().required('La categoría es obligatoria'),
  descripcion: yup.string().default(''),
  horarioApertura: yup.string().default('08:00'),
  horarioCierre: yup.string().default('22:00'),
  activo: yup.boolean().default(true),
  idUsuario: yup.number().required('El id de usuario es obligatorio'),
  imagenUrl: yup.string().default(''),
});

export type CreateRestaurantDto = yup.InferType<typeof createRestaurantSchema>;
