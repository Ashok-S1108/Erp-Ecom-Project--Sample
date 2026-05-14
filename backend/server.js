// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const supplierRoutes = require("./routes/supplier.routes");
const purchaseOrderRoutes = require("./routes/purchaseOrder.routes");
const inventoryTransactionRoutes = require("./routes/inventoryTransaction.routes");
const customerRoutes = require("./routes/customer.routes");
const reviewRoutes = require("./routes/review.routes");
const notificationRoutes = require("./routes/notification.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const reportRoutes = require("./routes/report.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cartRoutes");
const procurementRoutes = require("./routes/procurement.routes");
const salesRoutes = require("./routes/sales.routes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/inventory-transactions", inventoryTransactionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/procurements", procurementRoutes);
app.use("/api/sales", salesRoutes);



// Default route
app.get("/", (req, res) => {
    res.send("E-commerce + ERP API is running...");
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
