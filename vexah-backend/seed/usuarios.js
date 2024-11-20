import bcrypt from 'bcryptjs';

const usuarios = [
    {
        nombre: "Administrador",
        correo: "admin@vexah.com",
        clave: bcrypt.hashSync("12345678", 10),
        rol: "ADMINISTRADOR"
    },
    {
        nombre: "Juan Perez",
        correo: "juan.perez@vexah.com",
        clave: bcrypt.hashSync("12345678", 10),
        rol: "ASESOR_VENTAS"
    }
]

export default usuarios;