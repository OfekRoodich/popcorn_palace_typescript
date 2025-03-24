import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
export declare class MoviesService {
    private readonly movieRepository;
    constructor(movieRepository: Repository<Movie>);
    findAll(): Promise<Movie[]>;
    findOne(id: number): Promise<Movie | null>;
    findByTitle(title: string): Promise<Movie | null>;
    create(movie: Partial<Movie>): Promise<Movie>;
    update(id: number, movie: Partial<Movie>): Promise<any>;
    delete(id: number): Promise<any>;
    private validateMovie;
}
