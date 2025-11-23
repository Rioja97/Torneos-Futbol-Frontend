export interface Partido {
  id?: number;
  nombreEquipoLocal: string;
  nombreEquipoVisitante: string;
  nombreTorneo: string;
  fecha: string;
  resultado: string;
  jugado: boolean;
  estadisticas: [];
}
