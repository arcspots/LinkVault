const axios = require("axios");
const cheerio = require("cheerio");

const scrapeLink = async (url) => {
    try {
        const { data } = await axios.get(url, {
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });

        const $ = cheerio.load(data);

        const title =
            $('meta[property="og:title"]').attr("content") ||
            $("title").text() ||
            "No title";

        const description =
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") ||
            "No description";

        const image =
            $('meta[property="og:image"]').attr("content") ||
            null;

        return { title, description, image };
    } catch {
        return { title: url, description: "Could not fetch metadata", image: null };
    }
};

module.exports = { scrapeLink };