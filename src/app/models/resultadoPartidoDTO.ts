import { EstadisticaJugadorDTO } from "./estadisticaJugadorDTO";

export interface ResultadoPartidoDTO {
    resultado: string;
    estadisticasJugadores: EstadisticaJugadorDTO[];
}