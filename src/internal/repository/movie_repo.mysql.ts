import { Connection, RowDataPacket } from "mysql2"
import { MovieRepository, RepositoryErrors } from "./movie_repo.js"
import { DatabaseSettings } from "../../settings.js"
import { getMysqlConnection } from "../../database/mysql.js"
import Movie from "../models/movie.js"

export class MysqlRepo implements MovieRepository {

    #db: Connection

    constructor(dbSettings: DatabaseSettings) {
        this.#db = getMysqlConnection(dbSettings)
    }

    getMovies(limit: number, offset: number): Promise<Movie[]> {
        return new Promise((resolve, reject) => {

            if (limit <= 0 || !Number.isInteger(limit))
                return reject(RepositoryErrors.ErrLimitParamInvalid)

            if (offset < 0 || !Number.isInteger(offset))
                return reject(RepositoryErrors.ErrOffsetParamInvalid)

            this.#db.query("SELECT title, id, date FROM movies LIMIT ? OFFSET ?", [limit, offset], (err, results: RowDataPacket[]) => {

                if (err)
                    return reject(err)

                if (!results)
                    return reject(RepositoryErrors.ErrNoRows)

                const movies: Movie[] = results.map(({ title, date, id }) => {
                    return new Movie(title, date, id)
                })
                resolve(movies)
            })
        })
    }

    insertMovie(movie: Movie): void {
        const { title, date } = movie
        this.#db.execute("INSERT INTO movies (title, date) VALUES (?, ?)", [title, date], (err) => {
            if (err)
                console.error(err)
        })
    }
}