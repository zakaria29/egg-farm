import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getPacks = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allPacks = await prisma.packs.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })
        /** contains means search name of pack based on sent keyword */

        return response.json({
            status: true,
            data: allPacks,
            message: `Pack has retrieved`
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

export const createPack = async (request: Request, response: Response) => {
    try {
        const { name, price, capacity } = request.body /** get requested data (data has been sent from request) */

        /** process to save new pack */
        const newPack = await prisma.packs.create({
            data: {
                name, price: Number(price), capacity: Number(capacity)
            }
        })

        return response.json({
            status: true,
            data: newPack,
            message: `New Pack has created`
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

export const updatePack = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */
        const { name, price, capacity } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findPack = await prisma.packs.findFirst({ where: { id: Number(id) } })
        if (!findPack) return response
            .status(200)
            .json({ status: false, message: `Pack is not found` })

        /** process to update pack's data */
        const updatedPack = await prisma.packs.update({
            where: { id: Number(id) },
            data: {
                name: name || findPack.name,
                price: price ? Number(price) : findPack.price,
                capacity: capacity ? Number(capacity) : findPack.capacity
            }
        })
        return response.json({
            status: true,
            data: updatedPack,
            message: `Pack has updated`
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

export const dropPack = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */

        /** make sure that data is exists in database */
        const findPack = await prisma.packs.findFirst({ where: { id: Number(id) } })
        if (!findPack) return response
            .status(200)
            .json({ status: false, message: `Pack is not found` })

        /** process to delete pack's data */
        const deletedPack = await prisma.packs.delete({
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: deletedPack,
            message: `Pack has deleted`
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
