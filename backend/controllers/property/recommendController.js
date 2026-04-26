const Property = require("../../models/propertyModel");
const { getAggregationPipeline } = require("../../utils/aggregationPipeline");

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
            message: "Top 10 similar properties are:",
            length: properties.length,
            data: properties
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};