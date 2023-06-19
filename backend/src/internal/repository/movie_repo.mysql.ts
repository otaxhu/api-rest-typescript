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

            if (offset < 0 || !Number.isInteger(offset)) {
                console.log(offset, limit)
                return reject(RepositoryErrors.ErrOffsetParamInvalid)
            }

            this.#db.query("SELECT title, id, date, cover_url FROM movies LIMIT ? OFFSET ?", [limit, offset], (err, results: RowDataPacket[]) => {

                if (err)
                    return reject(err)

                if (!results.length)
                    return reject(RepositoryErrors.ErrNoRows)

                const movies: Movie[] = results.map(({ title, date, id, cover_url }) => {
                    return new Movie(title, date, id, cover_url)
                })
                resolve(movies)
            })
        })
    }

    getMovieById(id: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            this.#db.query("SELECT title, id, date, cover_url FROM movies WHERE id = ?", [id], (err, results: RowDataPacket[]) => {

                if (err)
                    return reject(err)

                if (!results.length)
                    return reject(RepositoryErrors.ErrNoRows)

                resolve(results[0] as Movie)
            })
        })
    }

    insertMovie({ title, date, cover_url }: Movie): Promise<void> {
        return new Promise((resolve, reject) => {
            this.#db.execute("INSERT INTO movies (title, date, cover_url) VALUES (?, ?, ?)", [title, date, cover_url], (err) => {

                if (err)
                    return reject(err)

                resolve()
            })
        })
    }
}