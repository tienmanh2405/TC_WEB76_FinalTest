import { FilmModel } from "../models/film.model.js";

const checkFilmExists = async (filmId) => {
    const film = await FilmModel.findById(filmId);
    return film !== null;
};


const getFilms = async (req, res) => {
    try {
        const { filters, sorting, pagination } = req.body;
        const { name } = filters || {};
        const { pageSize, pageNumber } = pagination || {};
        let query = FilmModel.find();

        if (name) {
            query = query.findOne({ name: { $regex: new RegExp(name, "i") } });
        }

        if (sorting && sorting.length > 0) {
            sorting.forEach(({ field, order }) => {
                if (field && order && (order === 1 || order === -1)) {
                    if (field === 'year') {
                        query = query.sort({ year: order });
                    }
                }
            });
        }

        if (pageSize !== -1) {
            const skip = (pageNumber - 1) * pageSize;
            query = query.skip(skip).limit(pageSize);
        }

        const users = await query;

        res.status(200).json({
            msg: 'Get users successfully!',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message,
            stack: err.stack
        });
    }
}
const createFilm = async (req, res) => {
    try {
        const { ID } = req.body;
        const idExists = await checkFilmExists(ID);
        if (idExists) {
            return res.status(400).json({ msg: "Film ID already exists" });
        }

        const newFilm = new FilmModel(req.body);
        await newFilm.save();
        res.status(201).json({ msg: "Film created successfully", film: newFilm });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

const updateFilm = async (req, res) => {
    try {
        const ID = req.params.id;
        const updatedFilm = await FilmModel.findByIdAndUpdate(ID, req.body, { new: true });
        if (!updatedFilm) {
            return res.status(404).json({ msg: "Film not found" });
        }
        res.status(200).json({ msg: "Film updated successfully", film: updatedFilm });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

const deleteFilm = async (req, res) => {
    try {
        const ID = req.params.id;
        const deletedFilm = await FilmModel.findByIdAndDelete(ID);
        if (!deletedFilm) {
            return res.status(404).json({ msg: "Film not found" });
        }
        res.status(200).json({ msg: "Film deleted successfully", film: deletedFilm });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

const searchFilmByName = async (req, res) => {
    try {
        const { name } = req.query;
        const films = await FilmModel.find({ name: { $regex: new RegExp(name, "i") } });
        res.status(200).json({ films: films });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

const sortFilmsByYear = async (req, res) => {
    try {
        const sortedFilms = await FilmModel.find().sort({ year: 1 });
        res.status(200).json({ films: sortedFilms });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export {
    createFilm,
    updateFilm,
    deleteFilm,
    searchFilmByName,
    sortFilmsByYear,
    getFilms
};
