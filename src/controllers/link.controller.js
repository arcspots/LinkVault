const prisma = require("../services/prisma.service");
const { scrapeLink } = require("../services/scraper.service");
const { categorizeLink } = require("../services/ai.service");

const createLink = async (req, res, next) => {
    try {
        const { url, collectionId } = req.body;

        const { title, description, image } = await scrapeLink(url);
        const { category, tags, summary } = await categorizeLink(title, description);

        const link = await prisma.link.create({
            data: {
                url, title, description, image,
                category, tags, summary,
                collectionId: collectionId || null,
                userId: req.user.userId
            }
        });

        res.status(201).json({ message: "Link saved!", link });
    } catch (err) {
        next(err);
    }
};

const getLinks = async (req, res, next) => {
    try {
        const { search, category, favorite, collectionId } = req.query;
        const where = { userId: req.user.userId };

        if (category) where.category = category;
        if (favorite === "true") where.favorite = true;
        if (collectionId) where.collectionId = Number(collectionId);
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
                { tags: { contains: search } },
                { summary: { contains: search } }
            ];
        }

        const links = await prisma.link.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { collection: { select: { id: true, name: true } } }
        });

        res.json({ total: links.length, links });
    } catch (err) {
        next(err);
    }
};

const clickLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        const link = await prisma.link.findFirst({
            where: { id: Number(id), userId: req.user.userId }
        });

        if (!link)
            return res.status(404).json({ error: "Link not found" });

        const updated = await prisma.link.update({
            where: { id: Number(id) },
            data: { clicks: { increment: 1 } }
        });

        res.json({ message: "Click registered!", clicks: updated.clicks });
    } catch (err) {
        next(err);
    }
};

const toggleFavorite = async (req, res, next) => {
    try {
        const { id } = req.params;
        const link = await prisma.link.findFirst({
            where: { id: Number(id), userId: req.user.userId }
        });

        if (!link)
            return res.status(404).json({ error: "Link not found" });

        const updated = await prisma.link.update({
            where: { id: Number(id) },
            data: { favorite: !link.favorite }
        });

        res.json({ message: `Link ${updated.favorite ? "favorited" : "unfavorited"}!`, favorite: updated.favorite });
    } catch (err) {
        next(err);
    }
};

const deleteLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        const link = await prisma.link.findFirst({
            where: { id: Number(id), userId: req.user.userId }
        });

        if (!link)
            return res.status(404).json({ error: "Link not found" });

        await prisma.link.delete({ where: { id: Number(id) } });
        res.json({ message: "Link deleted!" });
    } catch (err) {
        next(err);
    }
};

module.exports = { createLink, getLinks, clickLink, toggleFavorite, deleteLink };