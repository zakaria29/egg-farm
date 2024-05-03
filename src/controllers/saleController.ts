import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })
export const getAllSales = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allSales = await prisma.sales.findMany({
            where: {
                OR: [
                    { customer_name: { contains: search?.toString() || "" } },
                    { customer_address: { contains: search?.toString() || "" } }
                ]
            },
            /** contains means search name or address of customer based on sent keyword */
            orderBy: { sale_date: "desc" }, /** sort by descending sale date */
            include: { sale_details: true } /** include detail of sale (item that sold) */
        })
        return response.json({
            status: true,
            data: allSales,
            message: `Sale list has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createSale = async (request: Request, response: Response) => {
    try {
        const { customer_name, customer_address, customer_phone, sale_date, sale_details } = request.body
        /** get requested data (data has been sent from request) */
        /** 
         * assume that "sale_details" is an array of object that has keys: egg_id, egg_price, egg_qty, 
         * pack_id, pack_price, pack_qty 
         * */

        /** process to save new sales */
        const newSale = await prisma.sales.create({
            data: { customer_name, customer_address, customer_phone, sale_date }
        })

        /** loop details of sale to save in database */
        for (let index = 0; index < sale_details.length; index++) {
            const { egg_id, egg_price, egg_qty, pack_id, pack_price, pack_qty } = sale_details[index]
            await prisma.sale_details.create({
                data: {
                    sale_id: newSale.id, egg_id: Number(egg_id), egg_price: Number(egg_price), egg_qty: Number(egg_qty),
                    pack_id: Number(pack_id), pack_price: Number(pack_price), pack_qty: Number(pack_qty)
                }
            })
        }
        return response.json({
            status: true,
            data: newSale,
            message: `New Sale has created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const dropSale = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */

        /** make sure that data is exists in database */
        const findSale = await prisma.sales.findFirst({ where: { id: Number(id) } })
        if (!findSale) return response
            .status(200)
            .json({ status: false, message: `Sale is not found` })

        /** process to delete details of sales */
        let dropSaleDetail = await prisma.sale_details.deleteMany({ where: { sale_id: Number(id) } })
        /** process to delete of sale */
        let dropSale = await prisma.sales.delete({ where: { id: Number(id) } })

        return response.json({
            status: true,
            data: dropSale,
            message: `Sale has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}