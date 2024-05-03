import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** create schema for detail of sale */
const saleDetailSchema = Joi.object({
    egg_id: Joi.number().required(),
    egg_price: Joi.number().required(),
    egg_qty: Joi.number().required(),
    pack_id: Joi.number().required(),
    pack_price: Joi.number().required(),
    pack_qty: Joi.number().required(),
})

/** create schema when add new sale's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    sale_date: Joi.string().required(),
    customer_name: Joi.string().required(),
    customer_address: Joi.string().required(),
    customer_phone: Joi.string().required(),
    sale_details: Joi.array().items(saleDetailSchema).min(1).required()
})

export const verifyAddSale = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}
