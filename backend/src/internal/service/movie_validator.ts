import Joi from "joi"
import Movie from "../models/movie.js"
export const movieSaveValidator: Joi.ObjectSchema<Movie> = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    cover_url: Joi.string().required()
})