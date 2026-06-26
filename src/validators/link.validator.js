const { z } = require("zod");

const linkSchema = z.object({
    url: z.string().url("Invalid URL"),
    collectionId: z.number().optional()
});

module.exports = { linkSchema };