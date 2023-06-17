import { App } from "./internal/api/app.js";
import { newMovieRepository } from "./internal/repository/movie_repo.js";
import MovieService from "./internal/service/movie_service.js";
import { getDatabaseSettings, getServerSettings } from "./settings.js";

const serverSettings = getServerSettings()
const dbSettings = getDatabaseSettings()
const movieRepo = newMovieRepository(dbSettings)
const movieService = new MovieService(movieRepo)

const app = new App(serverSettings, movieService)
app.start()