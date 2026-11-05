export const catalogo = [
  { id: 'S1', nombre: 'Alcancía Mágica', icono: '🐷', tipo: 'simple', tasa: 0.02, plazoMin: 1, plazoMax: 12, minimo: 50, etapa: 1 },
  { id: 'S2', nombre: 'Granja Feliz', icono: '🐄', tipo: 'simple', tasa: 0.03, plazoMin: 2, plazoMax: 12, minimo: 100, etapa: 1 },
  { id: 'S3', nombre: 'Cohete Ahorrador', icono: '🚀', tipo: 'simple', tasa: 0.05, plazoMin: 4, plazoMax: 12, minimo: 200, etapa: 1 },
  { id: 'C1', nombre: 'Brote Mágico', icono: '🌱', tipo: 'compuesto', tasa: 0.02, plazoMin: 1, plazoMax: 12, minimo: 50, etapa: 4 },
  { id: 'C2', nombre: 'Árbol Frutal', icono: '🌳', tipo: 'compuesto', tasa: 0.03, plazoMin: 2, plazoMax: 12, minimo: 100, etapa: 4 },
  { id: 'C3', nombre: 'Bosque Encantado', icono: '🌲', tipo: 'compuesto', tasa: 0.05, plazoMin: 4, plazoMax: 12, minimo: 200, etapa: 4 },
]

export const productoPorId = (id) => catalogo.find((producto) => producto.id === id)
