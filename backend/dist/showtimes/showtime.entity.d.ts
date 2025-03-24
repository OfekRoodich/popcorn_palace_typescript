import { Movie } from '../movies/movie.entity';
export declare class Showtime {
    id: number;
    price: number;
    movieId: number;
    movie: Movie;
    theater: string;
    startTime: Date;
    endTime: Date;
}
