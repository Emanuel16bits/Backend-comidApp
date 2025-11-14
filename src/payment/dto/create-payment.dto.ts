import * as yup from 'yup';
import { EstadoPago, MetodoPago } from '../entities/payment.entity';

export const createPaymentSchema = yup.object({
  carritoId: yup
    .number()
    .typeError('El id del carrito tiene que ser un número')
    .integer('El id del carrito tiene que ser un número entero')
    .required('El id del carrito es obligatorio'),

  usuarioId: yup
    .number()
    .typeError('El id del usuario tiene que ser un número')
    .integer('El id del usuario tiene que ser un número entero')
    .required('El id del usuario es obligatorio'),

  monto: yup
    .number()
    .typeError('El monto tiene que ser un número')
    .min(0.01, 'El monto tiene que ser mayor a 0')
    .required('El monto es obligatorio'),

  metodo: yup
    .mixed<MetodoPago>()
    .oneOf(Object.values(MetodoPago), 'Método de pago no valido')
    .required('El metodo de pago es obligatorio'),

  estado: yup
    .mixed<EstadoPago>()
    .oneOf(Object.values(EstadoPago), 'Estado no valido')
    .default(EstadoPago.PENDIENTE),

  idTransaccion: yup.string().nullable(),

  detalles: yup.object().nullable().default(null),
});

export type CreatePaymentDto = yup.InferType<typeof createPaymentSchema>;
