import { createConnection } from "mysql2"
import { DatabaseSettings } from "../settings.js"

export function getMysqlConnection(dbSettings: DatabaseSettings) {
    const { host, port, dbName, user, password } = dbSettings;
    return createConnection({
        host,
        port,
        database: dbName,
        user,
        password
    })
}
