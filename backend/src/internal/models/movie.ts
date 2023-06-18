export default class Movie {
    id?: number
    title: string
    date: Date
    constructor(title: string, date: Date, id?: number) {
        this.id = id
        this.title = title
        this.date = date
    }

}