export interface Partido {
  id?: number;
  fecha: string;
  equipoLocalId: number;
  equipoVisitanteId: number;
  golesLocal?: number;
  golesVisitante?: number;
}
