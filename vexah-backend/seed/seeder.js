import { exit } from "node:process";
import db from "../config/db.js";

import usuarios from "./usuarios.js";

import { User } from '../models/index.js';

const importarDatos = async() => {
    try {
        await db.authenticate();
        await db.sync();

        await Promise.all([
            User.bulkCreate(usuarios)
        ]);

        console.log("Datos importados correctamente");
        exit(0);
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const eliminarDatos = async() => {
    try {
        await db.authenticate();
        await db.sync({force:true});

        console.log("Datos eliminados correctamente");
        exit(0);
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}