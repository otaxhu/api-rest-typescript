export default class Movie {
    id?: number
    title: string
    date: Date
    cover_url?: string
    constructor(title: string, date: Date, id?: number, cover_url?: string) {
        this.id = id
        this.title = title
        this.date = date
        this.cover_url = cover_url
    }

}