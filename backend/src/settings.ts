import "dotenv/config" // DELETE THIS ON PRODUCTION AND DONT USE .env FILES
import { env } from "process"

type Driver = "mysql" // Agregar mas uniones de tipos a medida de que se implementen mas bases de datos

export type DatabaseSettings = {
    // Propiedades requeridas
    driver: Driver
    host: string
    port: number
    dbName: string

    // Propiedades opcionales
    user?: string
    password?: string
}

export type ServerSettings = {
    port: number
}

export function getDatabaseSettings(): DatabaseSettings {
    let parsedPort = parseInt(env.DB_PORT ?? "")

    if (!env.DB_HOST || !env.DB_DRIVER || !env.DB_NAME || isNaN(parsedPort) || !parsedPort)
        throw Error("getDatabaseSettings(): some required env vars are undefined or the port is NaN or is 0.")

    if (env.DB_DRIVER !== "mysql")
        throw Error("getDatabaseSettings(): DB_DRIVER must be one of mysql")

    return {
        // Propiedades requeridas
        driver: env.DB_DRIVER,
        host: env.DB_HOST,
        dbName: env.DB_NAME,
        port: parsedPort,

        // Propiedades opcionales
        user: env.DB_USER,
        password: env.DB_PASSWORD,
    }
}

export function getServerSettings(): ServerSettings {
    let parsedPort = parseInt(env.SERVER_PORT ?? "")
    if (isNaN(parsedPort) || !parsedPort)
        throw Error("getServerSettings(): some required env vars are undefined or the port is NaN")

    return {
        port: parsedPort
    }
}
