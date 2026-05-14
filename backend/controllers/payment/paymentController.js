const Payment = require("../../models/paymentModel");
const Property = require("../../models/propertyModel");



// create payment by tenant
exports.createPayment = async (req, res) => {
  try {
    const propertyId = req.params.id
    const property = await Property.findById(propertyId).populate("owner");

    const payment = await Payment.create({
      tenantId: req.user.id,
      ownerId: property.owner._id,
      propertyId: propertyId,
      amount: property.price.value,
      status: "pending"
    });

    res.json({
      success: true,
      message: "Payment submitted, waiting for owner confirmation",
      payment
    });

  } catch (error) {
    res.status(500).json({success: false, error: error.message });
  }
};





// View incoming payments --> by owner
exports.getOwnerPayments = async (req, res) => {
  const payments = await Payment.find({ ownerId: req.user.id })
    .populate("tenantId propertyId");

  res.json(payments);
};





// Confirm  payment  --->  by owner
exports.confirmPayment = async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  payment.status = "confirmed";
  await payment.save();

  res.json({ message: "Payment confirmed" });
};




// Reject payment  --->  by owner
exports.rejectPayment = async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);

  payment.status = "rejected";
  await payment.save();

  res.json({ message: "Payment rejected" });
};



