// Text similarity function using TF-IDF and cosine similarity  - (title + description + location)


// librairies import
const natural = require("natural");    //NLP library for text processing and TF-IDF calculation
const TfIdf = natural.TfIdf;          // a class for computing TF-IDF(word importance) score
const cosineSimilarity = require("cosine-similarity");  // a function to calculate cosine similarity between two vectors (numerical representation of text)



function getTextSimilarity(p1, p2) {
  const tfidf = new TfIdf();        // create a new TF-IDF instance


//   combining textual fields of the properties into single documents for similarity comparison
  const doc1 = `${p1.title} ${p1.fullDescription} ${p1.location.province} ${p1.location.municipality} ${p1.location.district} ${p1.city}`;
  const doc2 = `${p2.title} ${p2.fullDescription} ${p2.location.province} ${p2.location.municipality} ${p2.location.district} ${p2.city}`;



  // add the documents to the TF-IDF instance - this will calculate the TF-IDF(term importance) scores for all terms in both documents
  tfidf.addDocument(doc1);
  tfidf.addDocument(doc2);


  //split both documents into unique terms , merge them into a single set, removes duplicates using Set,
  const terms = new Set([...doc1.split(" "), ...doc2.split(" ")]);


  // to store numerical representation of each document based on TF-IDF scores for the unique terms
  const vec1 = [];
  const vec2 = [];


    // for each unique term, get its TF-IDF score in both documents and push it to the respective vectors
  terms.forEach(term => {
    vec1.push(tfidf.tfidf(term, 0));
    vec2.push(tfidf.tfidf(term, 1));
  });



  // calculate and return the cosine similarity between the two vectors - this will give a similarity score between 0 and 1, where 1 --> completely similar and 0 --> completely different
  return cosineSimilarity(vec1, vec2);
}

module.exports = getTextSimilarity;