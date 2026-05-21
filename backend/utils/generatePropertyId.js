const Counter = require("../models/counterModel");

const generatePropertyId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "property" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const formatted = String(counter.seq).padStart(3, "0");
  return `ERN-${formatted}`;
};

module.exports = generatePropertyId;