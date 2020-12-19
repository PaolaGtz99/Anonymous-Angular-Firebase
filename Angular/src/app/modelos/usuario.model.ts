export class UsuarioModel {
    email: string;
    nombre: string;
    tipoUsuario: string;
    uid: string;
    doc: any;

    constructor(data: any) {


        this.doc = data;
        this.email = data.data().email;
        this.nombre = data.data().nombre;
        this.tipoUsuario = data.data().tipoUsuario;

        this.uid = data.data().uid;
    }
}