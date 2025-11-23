import { Equipo } from "./equipo.model";

export interface Jugador {
    id?: number;
    nombre: string;
    edad: number;
    posicion: string;
    dorsal: number;

    equipoId: number;

    nombreEquipo?: string;
    equipo?: Equipo;
}