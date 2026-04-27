// the function takes in an array of strings and returns an array of embeddings using hugging face api


const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();



// Funnction to generate embeddings from HuggingFaceEmbeddings (384 length vector)  --> takes input and returns vector embeddings
const getEmbeddings = async (text) => {
    const apiKey = process.env.HUGGING_FACE_EMBEDDINGS;

    if (!apiKey) {
        throw new Error("HUGGING_FACE_EMBEDDINGS environment variable is not set");
    }

    // config object
    const config = {
        method: 'POST',
        url: 'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction',     // hugging face model(all-MiniLM-L6-v2) endpoint   
        headers: {    // request header
            'Authorization': `Bearer ${apiKey}`,   
            'Content-Type': 'application/json'      // input/content/data type we sending is json
        },
        data: {             //request body
            inputs: text   // passing raw string or array of strings received from createEmbedding to model
        }
    };

    try {
        const response = await axios.request(config);     //sends request to huggung face api and awaits for response(enbeddings/vector)
        
        let embedding = response.data;


        // handle both single string and batch(group) cases  --> case when response is deeply nested like [[[num]]]
        if (Array.isArray(embedding) && Array.isArray(embedding[0]) && Array.isArray(embedding[0][0])) {
            // if it is [[[numbers/vector]]] --> take first sentence
            embedding = embedding[0][0];     //take innermost array which contains 384 numbers

        } else if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
            // if it is [[numbers/vector]] --> most common case for single input
            embedding = embedding[0];
        }



        // validate that we now have a correct flat array of 384 numbers
        if (!Array.isArray(embedding) || embedding.length !== 384) {
            throw new Error(`Invalid embedding format. Expected 384 dimensions, got ${embedding?.length}`);
        }


        return embedding;   // return clean 1D(flat) array like [0.12, -0.45, ...]   ,,,, This format is what mongoDB Vector Search expects.

    } catch (err) {
        console.error('HuggingFace API error:', err.response?.data || err.message);
        throw err;
    }
};



module.exports = { getEmbeddings };



// test
// getEmbeddings('house at itahari')
//     .then(res => console.log(res))
//     .catch(err => console.error(err));