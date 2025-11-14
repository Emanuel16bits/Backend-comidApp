import * as yup from 'yup';

export const createOrderItemSchema = yup.object().shape({
  idOrden: yup
    .number()
    .required('El id del pedido es obligatorio')
    .positive('Tiene que ser un numero positivo'),

  idProducto: yup
    .number()
    .required('El id del producto es obligatorio')
    .positive('Tiene que ser un numero positivo'),

  cantidad: yup
    .number()
    .required('La cantidad es obligatoria')
    .positive('Tiene que ser mayor a 0')
    .integer('Tiene que ser un numero entero'),
});

export type CreateOrderItemDto = {
  idOrden: number;
  idProducto: number;
  cantidad: number;
};
