import * as yup from 'yup';

export const updateDriverSchema = yup.object({
  nombre: yup.string().min(2).max(100).optional(),
  email: yup.string().email('Correo invalido').optional(),
  telefono: yup.string().optional(),
  vehiculo: yup
    .object({
      tipoVehiculo: yup
        .string()
        .oneOf(['Moto', 'Auto', 'Camioneta', 'Bicicleta', 'Otro'])
        .optional(),
      placa: yup.string().optional(),
      marca: yup.string().optional(),
      modelo: yup.string().optional(),
      color: yup.string().optional(),
      anio: yup.number().optional(),
    })
    .optional(),
  disponible: yup.boolean().optional(),
  calificacion: yup
    .number()
    .min(0, 'La calificacion minima es 0')
    .max(5, 'La calificacion maxima es 5')
    .optional(),
  gananciasTotales: yup
    .number()
    .min(0, 'Las ganancias no pueden ser negativas')
    .optional(),
});

export type UpdateDriverDto = yup.InferType<typeof updateDriverSchema>;
