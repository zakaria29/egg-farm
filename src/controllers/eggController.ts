import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllEggs = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allEggs = await prisma.eggs.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })
        /** contains means search name of egg based on sent keyword */
        return response.json({
            status: true,
            data: allEggs,
            message: `Eggs has retrieved`
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

export const createEgg = async (request: Request, response: Response) => {
    try {
        const { name, price, stock } = request.body /** get requested data (data has been sent from request) */

        /** variable filename use to define of uploaded file name */
        let filename = ""
        if (request.file) filename = request.file.filename /** get file name of uploaded file */

        /** process to save new egg */
        const newEgg = await prisma.eggs.create({
            data: { name, price: Number(price), stock: Number(stock), image: filename }
        })
        /** price and stock have to convert in number type */

        return response.json({
            status: true,
            data: newEgg,
            message: `New Egg has created`
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

export const updateEgg = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */
        const { name, price, stock } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findEgg = await prisma.eggs.findFirst({ where: { id: Number(id) } })
        if (!findEgg) return response
            .status(200)
            .json({ status: false, message: `Egg is not found` })

        let filename = findEgg.image /** default value of variable filename based on saved information */
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/egg-image/${findEgg.image}`
            let exists = fs.existsSync(path)
            if (exists && findEgg.image !== ``) fs.unlinkSync(path)

            /** this code use to delete old exists file if reupload new file */
        }

        /** process to update egg's data */
        const updatedEgg = await prisma.eggs.update({
            data: {
                name: name || findEgg.name,
                price: price ? Number(price) : findEgg.price,
                stock: stock ? Number(stock) : findEgg.stock,
                image: filename
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updatedEgg,
            message: `Egg has updated`
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

export const dropEgg = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        /** make sure that data is exists in database */
        const findEgg = await prisma.eggs.findFirst({ where: { id: Number(id) } })
        if (!findEgg) return response
            .status(200)
            .json({ status: false, message: `Egg is not found` })

        /** prepare to delete file of deleted egg's data */
        let path = `${BASE_URL}/public/egg-image/${findEgg.image}` /** define path (address) of file location */
        let exists = fs.existsSync(path)
        if (exists && findEgg.image !== ``) fs.unlinkSync(path) /** if file exist, then will be delete */

        /** process to delete egg's data */
        const deletedEgg = await prisma.eggs.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedEgg,
            message: `Egg has deleted`
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