import { redondear2 } from '../modelo/redondeo.js'

export const formatoMonedas = (valor) => `${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(redondear2(valor)).replaceAll('.', ' ')} 🪙`
