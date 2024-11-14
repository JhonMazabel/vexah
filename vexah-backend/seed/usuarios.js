import bcrypt from 'bcryptjs';

const usuarios = [
    {
        nombre: "Administrador",
        correo: "admin@vexah.com",
        clave: bcrypt.hashSync("12345678", 10),
        rol: "ADMINISTRADOR"
    }
]

export default usuarios;