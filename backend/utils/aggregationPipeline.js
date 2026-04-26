// This function creates a MongoDB Aggregation Pipeline for Vector Search.
// It finds the top 10 most similar properties based on vector embeddings (semantic similarity).


const {ObjectId} = require('mongodb')


// takes property embedding and id
function getAggregationPipeline(embeddings, id) {
    // Creates an array aggPipeline. In MongoDB, an aggregation pipeline is an array of stages. Each object inside is one stage.
    const aggPipeline = [
        // stage-1: Vector Search Stage
        {
            $vectorSearch: {
                index: "houserental_properties_index",               //name of vector search index in mongo db atlas
                path: "plot_embedding",                    // name of field that contains the embedding
                queryVector: embeddings,
                numCandidates: 100,                       // search 100 nearest docs
                limit: 11,                                // seturn top 11 results, 1 is that exactly same property
            },
        },
        // stage-2: Projection Stage
        {
            $project: { 
                plot_embedding: 0,                           // exclude the plot_embeddings array from the response beacuse of too large(to save bandwidth)
                "score": { "$meta": "vectorSearchScore" }    // adds a new field called score that shows how similar each property is to the query (higher score = more similar).
            }
        }
    ]

    // stage-3 : exclude the current movie from recommendation
    if (id) {
        aggPipeline.push({
            $match: { _id: { $ne: new ObjectId(id) } }
        });
    }

    // console.log("aggregation pipeline---> ", aggPipeline)  // debug
    return aggPipeline;       // returns the final aggregation pipeline array so it can be used later with .aggregate().
}



module.exports = {getAggregationPipeline}