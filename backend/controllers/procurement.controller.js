// controllers/procurement.controller.js
const Procurement = require("../models/procurement.model");
const Product = require("../models/product.model");
const Supplier = require("../models/supplier.model");
const InventoryTransaction = require("../models/inventoryTransaction.model");

// Create a new procurement
exports.createProcurement = async (req, res) => {
  try {
    const {
      supplier_id,
      products,
      expected_delivery_date,
      notes
    } = req.body;

    // Validate required fields
    if (!supplier_id || !products || products.length === 0) {
      return res.status(400).json({ 
        message: "Supplier and products are required" 
      });
    }

    // Validate supplier
    const supplier = await Supplier.findById(supplier_id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Validate products and calculate total
    let calculatedTotal = 0;
    const productUpdates = [];
    
    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product_id} not found` });
      }
      
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ 
          message: `Invalid quantity for product ${product.name}` 
        });
      }
      
      // Store unit price and calculate total
      const unitPrice = item.unit_price || product.price;
      calculatedTotal += unitPrice * item.quantity;
      productUpdates.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: unitPrice
      });
    }

    const procurement = new Procurement({
      supplier_id,
      products: productUpdates,
      expected_delivery_date,
      notes,
      total_amount: calculatedTotal,
      created_by: req.user.id
    });

    const savedProcurement = await procurement.save();
    
    // Populate references for response
    await savedProcurement.populate([
      { path: 'supplier_id', select: 'name email phone' },
      { path: 'products.product_id', select: 'name sku price' },
      { path: 'created_by', select: 'name email' }
    ]);
    
    res.status(201).json({
      message: "Procurement created successfully",
      procurement: savedProcurement
    });
  } catch (error) {
    console.error('Error creating procurement:', error);
    res.status(500).json({ 
      message: "Error creating procurement",
      error: error.message 
    });
  }
};

// Get all procurements with pagination and filtering
exports.getProcurements = async (req, res) => {
  try {
    const { 
      status, 
      supplier_id, 
      page = 1, 
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (supplier_id) filter.supplier_id = supplier_id;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const procurements = await Procurement.find(filter)
      .populate('supplier_id', 'name contact_email phone')
      .populate('products.product_id', 'name sku price')
      .populate('created_by', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Procurement.countDocuments(filter);

    res.json({
      procurements,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching procurements:', error);
    res.status(500).json({ 
      message: "Error fetching procurements",
      error: error.message 
    });
  }
};

// Get procurement by ID
exports.getProcurementById = async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id)
      .populate('supplier_id')
      .populate('products.product_id')
      .populate('created_by', 'name email');

    if (!procurement) {
      return res.status(404).json({ message: "Procurement not found" });
    }

    res.json(procurement);
  } catch (error) {
    console.error('Error fetching procurement:', error);
    res.status(500).json({ 
      message: "Error fetching procurement",
      error: error.message 
    });
  }
};

// Update procurement
exports.updateProcurement = async (req, res) => {
  try {
    const { products, expected_delivery_date, notes } = req.body;
    
    const procurement = await Procurement.findById(req.params.id);
    if (!procurement) {
      return res.status(404).json({ message: "Procurement not found" });
    }

    // Only allow updates if procurement is not completed or cancelled
    if (['completed', 'cancelled'].includes(procurement.status)) {
      return res.status(400).json({ 
        message: "Cannot update completed or cancelled procurement" 
      });
    }

    if (products) {
      // Recalculate total if products are updated
      let calculatedTotal = 0;
      const productUpdates = [];
      
      for (const item of products) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.product_id} not found` });
        }
        
        if (!item.quantity || item.quantity <= 0) {
          return res.status(400).json({ 
            message: `Invalid quantity for product ${product.name}` 
          });
        }
        
        const unitPrice = item.unit_price || product.price;
        calculatedTotal += unitPrice * item.quantity;
        productUpdates.push({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPrice
        });
      }
      procurement.total_amount = calculatedTotal;
      procurement.products = productUpdates;
    }

    if (expected_delivery_date) procurement.expected_delivery_date = expected_delivery_date;
    if (notes !== undefined) procurement.notes = notes;

    const updatedProcurement = await procurement.save();
    await updatedProcurement.populate([
      { path: 'supplier_id', select: 'name email phone' },
      { path: 'products.product_id', select: 'name sku price' }
    ]);

    res.json({
      message: "Procurement updated successfully",
      procurement: updatedProcurement
    });
  } catch (error) {
    console.error('Error updating procurement:', error);
    res.status(500).json({ 
      message: "Error updating procurement",
      error: error.message 
    });
  }
};

// Update procurement status
exports.updateProcurementStatus = async (req, res) => {
  try {
    const { status, actual_delivery_date } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ['pending', 'approved', 'ordered', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const procurement = await Procurement.findById(req.params.id)
      .populate('products.product_id');
      
    if (!procurement) {
      return res.status(404).json({ message: "Procurement not found" });
    }

    // Store old status for comparison
    const oldStatus = procurement.status;
    
    // Check if status transition is valid
    const validTransitions = {
      pending: ['approved', 'cancelled'],
      approved: ['ordered', 'cancelled'],
      ordered: ['shipped', 'cancelled'],
      shipped: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[oldStatus].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${oldStatus} to ${status}` 
      });
    }

    procurement.status = status;
    
    if (actual_delivery_date) procurement.actual_delivery_date = actual_delivery_date;

    // If status is changed to completed, update inventory
    if (status === 'completed' && oldStatus !== 'completed') {
      for (const item of procurement.products) {
        if (item.product_id) {
          // Update product stock quantity - ADD the procured amount
          await Product.findByIdAndUpdate(
            item.product_id._id,
            { 
              $inc: { stock_quantity: item.quantity } 
            }
          );

          // Create inventory transaction
          const transaction = new InventoryTransaction({
            product_id: item.product_id._id,
            quantity: item.quantity,
            type: 'incoming',
            transaction_type: 'procurement',
            reference_id: procurement._id,
            notes: `Procurement from ${procurement.supplier_id?.name || 'supplier'}`,
            unit_cost: item.unit_price,
            created_by: req.user.id
          });
          await transaction.save();
        }
      }
    }
    
    // If status is changed from completed to something else, reverse the inventory update
    if (oldStatus === 'completed' && status !== 'completed') {
      for (const item of procurement.products) {
        if (item.product_id) {
          // Reverse the stock quantity - SUBTRACT the previously added amount
          await Product.findByIdAndUpdate(
            item.product_id._id,
            { 
              $inc: { stock_quantity: -item.quantity } 
            }
          );

          // Create a reversal transaction
          const transaction = new InventoryTransaction({
            product_id: item.product_id._id,
            quantity: -item.quantity,
            type: 'outgoing',
            transaction_type: 'procurement_reversal',
            reference_id: procurement._id,
            notes: `Reversal of procurement #${procurement._id}`,
            unit_cost: item.unit_price,
            created_by: req.user.id
          });
          await transaction.save();
        }
      }
    }

    const updatedProcurement = await procurement.save();
    await updatedProcurement.populate([
      { path: 'supplier_id', select: 'name email phone' },
      { path: 'products.product_id', select: 'name sku price' },
      { path: 'created_by', select: 'name email' }
    ]);

    res.json({
      message: "Procurement status updated successfully",
      procurement: updatedProcurement
    });
  } catch (error) {
    console.error('Error updating procurement status:', error);
    res.status(500).json({ 
      message: "Error updating procurement status",
      error: error.message 
    });
  }
};

// Delete procurement
exports.deleteProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id);
    
    if (!procurement) {
      return res.status(404).json({ message: "Procurement not found" });
    }

    // If procurement was completed, reverse the inventory updates
    if (procurement.status === 'completed') {
      for (const item of procurement.products) {
        await Product.findByIdAndUpdate(
          item.product_id,
          { 
            $inc: { stock_quantity: -item.quantity } 
          }
        );

        // Create a reversal transaction
        const transaction = new InventoryTransaction({
          product_id: item.product_id,
          quantity: -item.quantity,
          type: 'outgoing',
          transaction_type: 'procurement_deletion',
          reference_id: procurement._id,
          notes: `Reversal due to deletion of procurement #${procurement._id}`,
          unit_cost: item.unit_price,
          created_by: req.user.id
        });
        await transaction.save();
      }
    }

    await Procurement.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Procurement deleted successfully" });
  } catch (error) {
    console.error('Error deleting procurement:', error);
    res.status(500).json({ 
      message: "Error deleting procurement",
      error: error.message 
    });
  }
};

// Get procurements by supplier
exports.getProcurementsBySupplier = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { supplier_id: req.params.supplierId };
    if (status) filter.status = status;

    const procurements = await Procurement.find(filter)
      .populate('products.product_id', 'name sku price')
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Procurement.countDocuments(filter);

    res.json({
      procurements,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching supplier procurements:', error);
    res.status(500).json({ 
      message: "Error fetching supplier procurements",
      error: error.message 
    });
  }
};

// Get procurement statistics
exports.getProcurementStats = async (req, res) => {
  try {
    const { startDate, endDate, supplier_id } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.created_at = {};
      if (startDate) matchStage.created_at.$gte = new Date(startDate);
      if (endDate) matchStage.created_at.$lte = new Date(endDate);
    }
    if (supplier_id) matchStage.supplier_id = supplier_id;

    const stats = await Procurement.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total_amount' },
          totalQuantity: { 
            $sum: { 
              $sum: '$products.quantity' 
            } 
          }
        }
      },
      {
        $group: {
          _id: null,
          statusCounts: { 
            $push: { 
              status: '$_id', 
              count: '$count', 
              totalAmount: '$totalAmount',
              totalQuantity: '$totalQuantity'
            } 
          },
          totalProcurements: { $sum: '$count' },
          grandTotalAmount: { $sum: '$totalAmount' },
          grandTotalQuantity: { $sum: '$totalQuantity' }
        }
      }
    ]);

    // Get monthly procurement data for charts
    const monthlyData = await Procurement.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$total_amount' },
          totalQuantity: { $sum: { $sum: '$products.quantity' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      overview: stats[0] || { 
        statusCounts: [], 
        totalProcurements: 0, 
        grandTotalAmount: 0,
        grandTotalQuantity: 0 
      },
      monthlyData
    });
  } catch (error) {
    console.error('Error fetching procurement statistics:', error);
    res.status(500).json({ 
      message: "Error fetching procurement statistics",
      error: error.message 
    });
  }
};