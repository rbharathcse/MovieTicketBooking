export interface MovieModel{
    id:string,
    movieName:string,
    movieDescription:string,
    movieDuration:number,
    movieRating:number,
    movieReleaseDate:Date,
    movieGenre:Genre,
    movieLanguage:string,
    movieUrl:string 
    
}

export enum Show{
    MORNINGSHOW="MORNINGSHOW",
    MAGNISHOW="MAGNISHOW",
    EVENINGSHOW="EVENINGSHOW",
    NIGHTSHOW="NIGHTSHOW"
}

export enum Genre{
    ACTION="Action",
    COMEDY="Comedy",
    DRAMA="Drama",
    HORROR="Horror",
    ROMANCE="Romance",
    THRILLER="Thriller"
}

export interface showDetails{
    id:string,
    movieId:string,
    startDate: string,
    endDate: string,
    showTime:string[],
    ticketPrice:number,
    screenNumber:number
    totalSeats:number
}

export interface resShowDetails{
    id:string,
    movieId:string,
    startDate: string,
    endDate: string,
    showTime:string,
    ticketPrice:number,
    screenNumber:number
    totalSeats:number
}

