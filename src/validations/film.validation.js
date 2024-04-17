import Joi from "joi";

export const createFilm = {
    body: Joi.object({
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
        time: Joi.number()
            .required(),
        year: Joi.number()
            .required(),
        image: Joi.string()
            .uri()
            .required(),
        introduce: Joi.string()
            .required()
    })
};

export const updateFilm = {
    params: Joi.object({
        id: Joi.string()
            .required()
    }),
    body: Joi.object({
        name: Joi.string()
            .required(),
        time: Joi.number()
            .required(),
        year: Joi.number()
            .required(),
        image: Joi.string()
            .uri()
            .required(),
        introduce: Joi.string()
            .required()
    })
};

export const deleteFilm = {
    params: Joi.object({
        id: Joi.string()
            .required()
    })
};