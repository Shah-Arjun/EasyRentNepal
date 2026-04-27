const Property = require("../../models/propertyModel");
const { getAggregationPipeline } = require("../../utils/aggregationPipeline");
const { getEmbeddings } = require("../../utils/getHuggingFaceEmbeddings");



// GET top 10 similar recommended prooerties against current property
exports.getSimilarRecommendProperties = async (req, res) => {
    try {
        const propertyId = req.params.id;

        const property = await Property.findById(propertyId).select('plot_embedding');

        if (!property || !property.plot_embedding) {
            return res.status(404).json({
                message: "Property or embedding not found"
            });
        }

        const plot_embedding = property.plot_embedding;

        if (!Array.isArray(plot_embedding) || plot_embedding.length !== 384) {
            return res.status(400).json({
                message: "Invalid embedding format"
            });
        }

        const aggregationPipeline = getAggregationPipeline(plot_embedding, propertyId);

        const properties = await Property.aggregate(aggregationPipeline);

        res.status(200).json({
            success: true,
            message: "Top 10 similar properties are:",
            length: properties.length,
            data: properties
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};







// semantic search
// get recommended movies based on search text/term (semantic search) using hugging face sentence-transformer
exports.getRecommendPropertiesBySearchTerm = async (req, res) => {
    try {
        // console.log("--------->", req.query) 
        const { query } = req.query;           // destructure the query parameter from the url

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }
        // console.log('query->', query);

        const plot_embedding = await getEmbeddings(query.trim());      // converts the users search text into a 384-dimensional embedding using Hugging Face.

        // console.log('movie------>', plot_embedding.length);
        if (!Array.isArray(plot_embedding) || plot_embedding.length !== 384) {
            return res.status(400).json({
                message: "Invalid embedding format"
            });
        }

        const aggregationPipeline = getAggregationPipeline(plot_embedding);      // calls aggregation pipeline function to build the vector search query based on embeddings
        
        const searchResult = await Property.aggregate(aggregationPipeline)      // runs the vector search on MongoDB and converts results to an array.
                           
        

        res.status(200).json({
            success: true,
            message: `Top ${searchResult.length} similar search reasults are: `,
            count: searchResult.length,
            data: searchResult
        });
    } catch (error) {
        console.error("Error in getRecommendPropertiesBySearchTerm:", error);        
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}