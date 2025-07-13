// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://snehapradeep5943:hzQIUNgFDKl13RRz@cluster0.ihgwpqr.mongodb.net/canteen_compass?retryWrites=true&w=majority&appName=Cluster0'


// MongoDB Models
const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: 'main' },
    createdAt: { type: Date, default: Date.now }
});

const ratingSchema = new mongoose.Schema({
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const wasteLogSchema = new mongoose.Schema({
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['trays', 'plates', 'buckets', 'kg'], required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['available', 'taken', 'disposed'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

const studentReportSchema = new mongoose.Schema({
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    description: { type: String, required: true },
    estimatedQuantity: { type: String, required: true },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Create models
const FoodItem = mongoose.model('FoodItem', foodItemSchema);
const Rating = mongoose.model('Rating', ratingSchema);
const WasteLog = mongoose.model('WasteLog', wasteLogSchema);
const StudentReport = mongoose.model('StudentReport', studentReportSchema);

async function initializeDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB database');
        
        // Insert sample data if collection is empty
        await insertSampleData();
        
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

async function insertSampleData() {
    try {
        const count = await FoodItem.countDocuments();
        
        if (count === 0) {
            const foodItems = [
                { name: 'Rice', category: 'main' },
                { name: 'Dal', category: 'main' },
                { name: 'Sabzi', category: 'main' },
                { name: 'Roti', category: 'main' },
                { name: 'Sambar', category: 'main' },
                { name: 'Rasam', category: 'main' },
                { name: 'Curd', category: 'side' }
            ];
            
            await FoodItem.insertMany(foodItems);
            console.log('Sample data inserted');
        }
    } catch (error) {
        console.log('Error inserting sample data:', error.message);
    }
}

// API Routes

// Get all food items
app.get('/api/food-items', async (req, res) => {
    try {
        const foodItems = await FoodItem.find().sort({ name: 1 });
        res.json(foodItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit rating
app.post('/api/ratings', async (req, res) => {
    try {
        const { food_item_id, meal_type, rating, comments } = req.body;
        
        const newRating = new Rating({
            foodItemId: food_item_id,
            mealType: meal_type,
            rating: rating,
            comments: comments || null
        });
        
        const savedRating = await newRating.save();
        
        res.json({ 
            success: true, 
            message: 'Rating submitted successfully',
            id: savedRating._id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get ratings stats
app.get('/api/ratings/stats', async (req, res) => {
    try {
        const totalRatings = await Rating.countDocuments();
        const avgResult = await Rating.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);
        
        const averageRating = avgResult.length > 0 ? avgResult[0].avgRating : 0;
        
        res.json({
            totalRatings: totalRatings,
            averageRating: parseFloat(averageRating).toFixed(1)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recent ratings
app.get('/api/ratings/recent', async (req, res) => {
    try {
        const recentRatings = await Rating.find()
            .populate('foodItemId', 'name')
            .sort({ createdAt: -1 })
            .limit(10);
        
        // Transform data to match frontend expectations
        const transformedRatings = recentRatings.map(rating => ({
            ...rating.toObject(),
            food_name: rating.foodItemId.name,
            created_at: rating.createdAt
        }));
        
        res.json(transformedRatings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Log waste (Admin only)
app.post('/api/waste', async (req, res) => {
    try {
        const { food_item_id, meal_type, quantity, unit, date } = req.body;
        
        const newWasteLog = new WasteLog({
            foodItemId: food_item_id,
            mealType: meal_type,
            quantity: quantity,
            unit: unit,
            date: new Date(date)
        });
        
        const savedWasteLog = await newWasteLog.save();
        
        res.json({ 
            success: true, 
            message: 'Waste logged successfully',
            id: savedWasteLog._id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get available leftovers
app.get('/api/leftovers', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const leftovers = await WasteLog.find({
            date: { $gte: today, $lt: tomorrow },
            status: 'available',
            quantity: { $gt: 0 }
        })
        .populate('foodItemId', 'name')
        .sort({ createdAt: -1 });
        
        // Transform data to match frontend expectations
        const transformedLeftovers = leftovers.map(leftover => ({
            ...leftover.toObject(),
            food_name: leftover.foodItemId.name,
            meal_type: leftover.mealType
        }));
        
        res.json(transformedLeftovers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark leftover as taken
app.put('/api/leftovers/:id/take', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        
        const wasteLog = await WasteLog.findById(id);
        
        if (!wasteLog) {
            return res.status(404).json({ error: 'Leftover not found' });
        }
        
        const newQuantity = Math.max(0, wasteLog.quantity - (quantity || 1));
        const newStatus = newQuantity === 0 ? 'taken' : 'available';
        
        wasteLog.quantity = newQuantity;
        wasteLog.status = newStatus;
        
        await wasteLog.save();
        
        res.json({ 
            success: true, 
            message: 'Marked as taken',
            newQuantity: newQuantity
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit student report
app.post('/api/reports', async (req, res) => {
    try {
        const { food_item_id, meal_type, description, estimated_quantity } = req.body;
        
        const newReport = new StudentReport({
            foodItemId: food_item_id,
            mealType: meal_type,
            description: description,
            estimatedQuantity: estimated_quantity
        });
        
        const savedReport = await newReport.save();
        
        res.json({ 
            success: true, 
            message: 'Report submitted successfully',
            id: savedReport._id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const totalWasteResult = await WasteLog.aggregate([
            { $group: { _id: null, totalWaste: { $sum: '$quantity' } } }
        ]);
        
        const totalRatings = await Rating.countDocuments();
        
        const avgRatingResult = await Rating.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);
        
        const pendingReports = await StudentReport.countDocuments({ status: 'pending' });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const todayLeftovers = await WasteLog.countDocuments({
            date: { $gte: today, $lt: tomorrow },
            status: 'available'
        });
        
        res.json({
            totalWaste: totalWasteResult.length > 0 ? totalWasteResult[0].totalWaste : 0,
            totalRatings: totalRatings,
            averageRating: avgRatingResult.length > 0 ? parseFloat(avgRatingResult[0].avgRating).toFixed(1) : '0.0',
            pendingReports: pendingReports,
            todayLeftovers: todayLeftovers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
async function startServer() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    await mongoose.connection.close();
    process.exit(0);
});


//needs further development accordingly