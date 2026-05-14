const { getEmbeddings } = require("./getHuggingFaceEmbeddings");

const createNewPropertyEmbeddingWhiteAdding = async (property) => {

    try {

        // prepare text
        const inputText = `
            ${property.title || ""}
            ${property.category || ""}
            ${property.fullDescription || ""}
            ${property.location?.province || ""}
            ${property.location?.district || ""}
            ${property.location?.municipality || ""}
            ${property.furnishedStatus || ""}
        `.trim();

        // skip if empty
        if (!inputText) {
            return null;
        }

        // generate embedding
        const embedding = await getEmbeddings(inputText);

        // validate embedding
        if (!Array.isArray(embedding) || embedding.length !== 384) {
            throw new Error("Invalid embedding format from createNewPropertyEmbeddingWhiteAdding");
        }

        return embedding;

    } catch (error) {

        console.error("Create New Property Embedding While Adding Error:", error.message);

        return null;
    }
};

module.exports = { createNewPropertyEmbeddingWhiteAdding };