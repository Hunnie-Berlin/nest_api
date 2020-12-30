import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should return a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test'],
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with the ID 999 is not Found');
      }
    });
  });

  describe('deleteOne()', () => {
    it('should delete a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test'],
      });
      const allMovies = service.getAll();
      service.deleteOne(1);
      const afterDelete = service.getAll();
      expect(afterDelete.length).toEqual(allMovies.length - 1);
      try {
        service.getOne(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
    it('should return 404 error', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create()', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test'],
      });
      const afterCreate = service.getAll().length;
      expect(beforeCreate + 1).toEqual(afterCreate);
    });
  });

  describe('update()', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test'],
      });
      service.update(1, { title: 'Updated Movie' });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('Updated Movie');
    });
    it('should return 404 error', () => {
      try {
        service.update(999, { title: 'Updated Movie' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
