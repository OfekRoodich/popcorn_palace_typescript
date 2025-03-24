import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    findAll(): Promise<Movie[]>;
    create(movie: Partial<Movie>): Promise<Movie>;
    updateByTitle(title: string, movie: Partial<Movie>): Promise<Partial<Movie>>;
    deleteByTitle(title: string): Promise<void>;
    findOne(id: number): Promise<Movie>;
}
