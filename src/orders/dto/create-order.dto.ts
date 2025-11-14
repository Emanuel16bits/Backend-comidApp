import * as yup from 'yup';
import { EstadoOrden } from '../entities/order.entity';

export const createOrderSchema = yup.object().shape({
  precioTotal: yup
    .number()
    .required('El precio total es obligatorio')
    .min(0, 'El precio total tiene qu ser mayor o igual a 0'),

  idUsuario: yup.number().required('El id del usuario es obligatorio'),

  estado: yup
    .mixed<EstadoOrden>()
    .oneOf(
      [
        EstadoOrden.PENDIENTE,
        EstadoOrden.EN_PREPARACION,
        EstadoOrden.EN_CAMINO,
        EstadoOrden.ENTREGADA,
        EstadoOrden.CANCELADA,
      ],
      'Estado no válido',
    )
    .default(EstadoOrden.PENDIENTE),
});

export type CreateOrderDto = yup.InferType<typeof createOrderSchema>;
