import Movie from "../models/movie.js"
import { DatabaseSettings } from "../../settings.js"
import { MysqlRepo } from "./movie_repo.mysql.js"

export interface MovieRepository {

    getMovies(limit: number, offset: number): Promise<Movie[]>
    insertMovie(movie: Movie): void

}

export function newMovieRepository(dbSettings: DatabaseSettings): MovieRepository {
    const { driver } = dbSettings

    switch (driver) {
        case "mysql":
            return new MysqlRepo(dbSettings)

        default:
            throw Error("newMovieRepository(): the specified database driver does not have a repository implementation.")
    }
}
