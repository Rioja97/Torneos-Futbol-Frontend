export interface Partido {
    id?: number;
    fecha: string; // Usamos string para LocalDate (yyyy-MM-dd)
    jugado: boolean;
    resultado?: string;
    
    // Resultados (pueden ser nulos si no se jugó)
    golesLocal?: number;
    golesVisitante?: number;

    // RELACIONES (Para el Formulario - IDs)
    torneoId: number;
    equipoLocalId: number;
    equipoVisitanteId: number;

    // RELACIONES (Para la Vista - Nombres)
    nombreTorneo?: string;
    nombreEquipoLocal?: string;
    nombreEquipoVisitante?: string;
}
