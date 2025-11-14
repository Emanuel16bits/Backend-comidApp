import * as yup from 'yup';

export const updateReviewSchema = yup.object().shape({
  calificacion: yup.number().min(1, 'Minimo 1').max(5, 'Maximo 5').optional(),
  comentario: yup.string().max(1000, 'Maximo 1000 letras').optional(),
});

export type UpdateReviewDto = yup.InferType<typeof updateReviewSchema>;
