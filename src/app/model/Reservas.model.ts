export class Reservas{
    constructor(
        public celular_confirmacion?:string,
        public correo_confirmacion?:string,
        public fecha?:Date,
        public horarios_inicios?:string,
        public horarios_fin?:string,
        public telf_confirmacion?:string,
        public usuario_id?:string
    ){};
}