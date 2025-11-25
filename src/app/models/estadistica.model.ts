export interface Estadistica {
  jugadorId: number;
  nombreJugador?: string;
  torneoId?: number;
  goles: number;
  asistencias: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
}