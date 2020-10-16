

export class Usuario {

    static fromFirebase( { email, nombre, uid } ) {
        return new Usuario( uid, nombre, email );
    }

    constructor( public nombre: string, public uid: string, public email: string ) {}
}