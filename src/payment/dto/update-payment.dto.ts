import * as yup from 'yup';
import { EstadoPago, MetodoPago } from '../entities/payment.entity';

export const updatePaymentSchema = yup.object({
  carritoId: yup
    .number()
    .typeError('El id del carrito tiene que ser un número')
    .integer('El id del carrito tiene que ser un número entero')
    .notRequired(),

  usuarioId: yup
    .number()
    .typeError('El id del usuario tiene que ser un número')
    .integer('El id del usuario tiene que ser un número entero')
    .notRequired(),

  monto: yup
    .number()
    .typeError('El monto tiene que ser un número')
    .min(0.01, 'El monto tiene que ser mayor a 0')
    .notRequired(),

  metodo: yup
    .mixed<MetodoPago>()
    .oneOf(Object.values(MetodoPago), 'Metodo de pago no valido')
    .notRequired(),

  estado: yup
    .mixed<EstadoPago>()
    .oneOf(Object.values(EstadoPago), 'Estado de pago no valido')
    .notRequired(),

  idTransaccion: yup.string().nullable().notRequired(),

  detalles: yup.object().nullable().notRequired(),
});

export type UpdatePaymentDto = yup.InferType<typeof updatePaymentSchema>;
