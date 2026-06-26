const prisma = require("../services/prisma.service");

const createCollection = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ error: "Name is required" });

        const collection = await prisma.collection.create({
            data: { name, userId: req.user.userId }
        });

        res.status(201).json({ message: "Collection created!", collection });
    } catch (err) {
        next(err);
    }
};

const getCollections = async (req, res, next) => {
    try {
        const collections = await prisma.collection.findMany({
            where: { userId: req.user.userId },
            include: { _count: { select: { links: true } } },
            orderBy: { createdAt: "desc" }
        });

        res.json({ collections });
    } catch (err) {
        next(err);
    }
};

const deleteCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const collection = await prisma.collection.findFirst({
            where: { id: Number(id), userId: req.user.userId }
        });

        if (!collection)
            return res.status(404).json({ error: "Collection not found" });

        await prisma.collection.delete({ where: { id: Number(id) } });
        res.json({ message: "Collection deleted!" });
    } catch (err) {
        next(err);
    }
};

module.exports = { createCollection, getCollections, deleteCollection };