import * as yup from 'yup';

export const createReviewSchema = yup.object().shape({
  calificacion: yup
    .number()
    .required('La calificación es obligatoria')
    .min(1, 'Minimo 1')
    .max(5, 'Maximo 5'),
  comentario: yup.string().required('El comentario es obligatorio').max(1000),
});

export type CreateReviewDto = yup.InferType<typeof createReviewSchema>;
