const PurchaseOrder = require("../models/purchaseOrder.model");
const InventoryTransaction = require("../models/inventoryTransaction.model");

// Create purchase order
exports.createPurchaseOrder = async (req, res) => {
    try {
        const po = new PurchaseOrder(req.body);
        await po.save();
        res.status(201).json({ message: "Purchase order created successfully", po });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all purchase orders
exports.getPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find().populate("supplier");
        res.json(purchaseOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update purchase order status
exports.updatePurchaseOrderStatus = async (req, res) => {
    try {
        const po = await PurchaseOrder.findById(req.params.id);
        if (!po) return res.status(404).json({ message: "Purchase order not found" });

        po.status = req.body.status;
        await po.save();

        // If status is "Received", log inventory transaction
        if (req.body.status === "Received") {
            const transaction = new InventoryTransaction({
                product: po.product,
                quantity: po.quantity,
                type: "IN",
                reference: `PO-${po._id}`
            });
            await transaction.save();
        }

        res.json({ message: "Purchase order updated", po });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
