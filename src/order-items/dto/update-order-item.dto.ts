import * as yup from 'yup';

export const updateOrderItemSchema = yup.object({
  cantidad: yup
    .number()
    .positive('Tiene que ser mayor a 0')
    .integer('Tiene que ser un numero entero')
    .optional(),
});

export type UpdateOrderItemDto = yup.InferType<typeof updateOrderItemSchema>;
