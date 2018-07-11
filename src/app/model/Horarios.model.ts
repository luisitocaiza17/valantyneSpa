export class horarios{
    constructor(
        public hora_fin?:Date,
        public hora_inicio?:Date,
        public nombre?:String,
        public dia?:number,
        public seleccionado?:boolean,
        public turno?:number,
    ){};
}