import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { Movie } from '../movies/movie.entity';
export declare class ShowtimesService {
    private readonly showtimeRepository;
    private readonly movieRepository;
    constructor(showtimeRepository: Repository<Showtime>, movieRepository: Repository<Movie>);
    findAll(): Promise<Showtime[]>;
    findById(id: number): Promise<Showtime>;
    getShowtimeById(id: number): Promise<any>;
    findAllForTheater(theater: string): Promise<Showtime[]>;
    create(data: Partial<Showtime>): Promise<Partial<Showtime>>;
    update(id: number, data: Partial<Showtime>): Promise<Showtime>;
    delete(id: number): Promise<void>;
    private hasOverlap;
}
