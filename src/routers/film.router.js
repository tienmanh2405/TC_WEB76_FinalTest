import express from 'express';
import {
    createFilm,
    updateFilm,
    deleteFilm,
    getFilms
} from '../controllers/film.controller.js';
import uploadImageAndUpdateFilm from '../controllers/upload.controller.js';
import validation from '../middlewares/validationMiddleware.js';
import { createFilm as createFilmSchema, updateFilm as updateFilmSchema, deleteFilm as deleteFilmSchema } from '../validations/film.validation.js';
import uploader from '../middlewares/uploader.middlewares.js';

const router = express.Router();

router.post('/', getFilms); // search + sort + getAllFilms+ pagination
router.post('/', validation(createFilmSchema), createFilm);
router.put('/:id', validation(updateFilmSchema), updateFilm);
router.delete('/:id', validation(deleteFilmSchema), deleteFilm);


// Route API để xử lý upload hình ảnh và cập nhật phim
router.post('/:filmId/upload-image', uploader.single('image'), uploadImageAndUpdateFilm);

export default router;