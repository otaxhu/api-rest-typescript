import express, { Application } from "express"
import { registerMoviesRoutes } from "./routes/index.js"
import { ServerSettings } from "../../settings.js"
import MovieService from "../service/movie_service.js"
import bodyParser from "body-parser"

export class App {
    #app: Application
    #port: number
    constructor(serverSettings: ServerSettings, movieService: MovieService) {
        this.#app = express()
        this.#app.use(bodyParser.json())
        this.#app.use("/static", express.static("./static"))
        this.#port = serverSettings.port
        this.#app.set("port", this.#port)
        registerMoviesRoutes(this.#app, movieService)
    }
    start() {
        this.#app.listen(this.#port, () => console.log(`Server HTTP listening in port ${this.#port}`))
    }
}