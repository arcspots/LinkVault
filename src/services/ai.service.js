const axios = require("axios");

const categorizeLink = async (title, description) => {
    try {
        const prompt = `Based on this link title and description, return a JSON with:
- "category": one of (Technology, Finance, Design, Health, Education, Entertainment, News, Other)
- "tags": array of max 3 relevant keywords
- "summary": one sentence summarizing what this link is about in English

Title: ${title}
Description: ${description}

Respond ONLY with valid JSON, nothing else. Example:
{"category": "Technology", "tags": ["javascript", "tutorial", "web"], "summary": "A tutorial about JavaScript web development."}`;

        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "llama3.2",
            prompt,
            stream: false
        });

        const text = response.data.response.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const json = JSON.parse(jsonMatch[0]);

        return {
            category: json.category || "Other",
            tags: Array.isArray(json.tags) ? json.tags.join(",") : "",
            summary: json.summary || ""
        };
    } catch {
        return { category: "Other", tags: "", summary: "" };
    }
};

module.exports = { categorizeLink };