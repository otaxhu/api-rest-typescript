import { Application } from "express";
import HandlerMovies from "../handlers/movies.js";
import MovieService from "../../service/movie_service.js";
import multer from "multer"
import { randomUUID } from "crypto";
import { extname } from "path";

const storage = multer.diskStorage({
    destination: "./static/covers",
    filename: (req, file, cb) => {
        const fileName = randomUUID() + extname(file.originalname)
        cb(null, fileName)
    }
})

const upload = multer({ storage })

export function registerMoviesRoutes(app: Application, service: MovieService) {
    const handlerMovies = new HandlerMovies(service)

    app.get("/movies/:id",
        handlerMovies.getMovieById.bind(handlerMovies))

    app.get("/movies",
        handlerMovies.getMovies.bind(handlerMovies))

    app.post("/movies",
        upload.single("cover"),
        handlerMovies.postMovie.bind(handlerMovies))
}