// one time code for creating embeddings of already existing documents in db - This script connects to the MongoDB database, retrieves movie documents that have a Plot but do not yet have an embedding, generates embeddings using the Hugging Face API, and updates the documents with the new plot_embedding field. It includes error handling and logs progress along the way.


// updateMovieEmbeddings.js
const mongoose = require("mongoose");
const connectMongoDB = require("../database/db");
const Property = require("../models/propertyModel");
const { getEmbeddings } = require("./getHuggingFaceEmbeddings");


// collection name where property data is stored
const COLLECTION_NAME = 'properties';


// // function to update property data with embeddings in db
async function updatePropertyDataWithEmbeddings() {
    let propertiesCollection;

    try {
            // propertiesCollection = await getCollection(COLLECTION_NAME);     // connect to db if not already connected and get collection named as 'properties'
        await connectMongoDB();    // connect to MongoDB database using connection string from .env file
        // propertiesCollection = mongoose.connection.collection(COLLECTION_NAME);   // get the 'properties' collection from the connected database

        // only process documents that don't have embedding yet
        const cursor = Property.find({                                     // creates a cursor (pointer) to fetch only those properties that:-
            title: { $exists: true, $ne: "" },                                               // have a Plot field, and
            plot_embedding: { $exists: false }   // skip already processed ones    //do not have plot_embedding yet
        }).cursor();

        // to store counts
        let processed = 0;
        let failed = 0;


         // Loop over each document/data
        for await (const doc of cursor) {
            try {
                const inputText = `
                    ${doc.title || ''}
                    ${doc.category || ''}
                    ${doc.fullDescription || ''}
                    ${doc.location?.province || ''}
                    ${doc.location?.district || ''}
                    ${doc.location?.municipality || ''}
                    ${doc.furnishedStatus || ''}
                    `.trim();  //Combines important fields (Title, Genre, Plot, Actors) into one string, .trim() removes extra spaces. This text will be sent to Hugging Face for embedding.

                if (!inputText) {
                    console.log(`Skipping ${doc.title} - no text content`);
                    continue;
                }

                const embedding = await getEmbeddings(inputText);   //calls and inputtext to Hugging Face API to generate 384-dimensional vector embedding for the property.


                if (!Array.isArray(embedding) || embedding.length !== 384) {
                    throw new Error("Invalid embedding format");
                }

                // console.log(`Embedding for ${doc.title}:`, embedding.slice(0, 5), "...");  // Log first 5 values of the embedding for verification
               
                doc.plot_embedding = embedding;
                await doc.save();


                processed++;        //processed doc count
                console.log(`Updated: ${doc.title} (${processed})`);

                // small delay to avoid rate limits -- avoid blocking by hugging face
                await new Promise(r => setTimeout(r, 200));      //100ms delay = 0.1sec

            } catch (err) {
                failed++;
                console.error(`Failed ${doc.title}:`, err.message);
                // Continue with next movie instead of crashing
            }
        }

        console.log(`\nEmbeddings Done! Processed: ${processed}, Failed: ${failed}`);

    } catch (err) {
        console.error("Fatal error:", err);   // error like db connection error
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
}



// calling the function
updatePropertyDataWithEmbeddings();