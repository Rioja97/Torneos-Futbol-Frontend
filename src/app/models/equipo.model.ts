export interface Estadio{
    nombre: String,
    capacidad: number
}

export interface Equipo{
    id?: number,
    nombre: string,
    ciudad: string,
    estadio: Estadio

}