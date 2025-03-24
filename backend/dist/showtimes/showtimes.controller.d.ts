import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { Showtime } from './showtime.entity';
export declare class ShowtimesController {
    private readonly showtimesService;
    private readonly moviesService;
    constructor(showtimesService: ShowtimesService, moviesService: MoviesService);
    getShowtimeById(id: number): Promise<Showtime>;
    create(showtime: Partial<Showtime>): Promise<Partial<Showtime>>;
    update(id: number, showtime: Partial<Showtime>): Promise<{
        id: number;
        price: number;
        movieId: number;
        theater: string;
        startTime: Date;
        endTime: Date;
    }>;
    delete(id: number): Promise<void>;
    private validateShowtime;
}
