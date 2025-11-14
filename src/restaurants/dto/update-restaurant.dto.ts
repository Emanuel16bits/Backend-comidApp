import * as yup from 'yup';

export const updateRestaurantSchema = yup.object().shape({
  nombre: yup.string().max(100, 'Maximo 100 letras').optional(),
  descripcion: yup.string().max(1000, 'Maximo 1000 letras').optional(),
  direccion: yup.string().max(200, 'Maximo 200 letras').optional(),
  categoria: yup.string().max(50, 'Maximo 50 letras').optional(),
  horarioApertura: yup.string().optional(),
  horarioCierre: yup.string().optional(),
  activo: yup.boolean().optional(),
});

export type UpdateRestaurantDto = yup.InferType<typeof updateRestaurantSchema>;
