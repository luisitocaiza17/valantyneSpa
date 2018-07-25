export class Reservas{
    constructor(
        public celular_confirmacion?:string,
        public correo_confirmacion?:string,
        public fecha?:Date,
        public horarios_inicios?:Date,
        public horarios_fin?:Date,
        public telf_confirmacion?:string,
        public usuario_id?:string,
        public turno?:number,
        public amarillo?:boolean,
        public id?:string
    ){};
}