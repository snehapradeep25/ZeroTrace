// Data storage
let wasteData = [];
let ratingsData = [];
let leftoversData = [];
let hostels = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D'];
let currentChart = null;
let currentChartType = 'waste-trend';

// Initialize with some dummy data
function initializeDummyData() {
    // Sample waste data with dates over the last 7 days
    const today = new Date();
    wasteData = [
        {date: getDateString(today, -6), meal: 'breakfast', dish: 'roti', quantity: 3, unit: 'trays'},
        {date: getDateString(today, -6), meal: 'lunch', dish: 'rice', quantity: 5, unit: 'trays'},
        {date: getDateString(today, -6), meal: 'dinner', dish: 'dal', quantity: 2, unit: 'trays'},
        {date: getDateString(today, -5), meal: 'breakfast', dish: 'roti', quantity: 4, unit: 'trays'},
        {date: getDateString(today, -5), meal: 'lunch', dish: 'rice', quantity: 7, unit: 'trays'},
        {date: getDateString(today, -5), meal: 'dinner', dish: 'sabzi', quantity: 3, unit: 'trays'},
        {date: getDateString(today, -4), meal: 'breakfast', dish: 'roti', quantity: 2, unit: 'trays'},
        {date: getDateString(today, -4), meal: 'lunch', dish: 'dal', quantity: 4, unit: 'trays'},
        {date: getDateString(today, -4), meal: 'dinner', dish: 'rice', quantity: 6, unit: 'trays'},
        {date: getDateString(today, -3), meal: 'breakfast', dish: 'roti', quantity: 3, unit: 'trays'},
        {date: getDateString(today, -3), meal: 'lunch', dish: 'sabzi', quantity: 5, unit: 'trays'},
        {date: getDateString(today, -3), meal: 'dinner', dish: 'dal', quantity: 2, unit: 'trays'},
        {date: getDateString(today, -2), meal: 'breakfast', dish: 'roti', quantity: 1, unit: 'trays'},
        {date: getDateString(today, -2), meal: 'lunch', dish: 'rice', quantity: 8, unit: 'trays'},
        {date: getDateString(today, -2), meal: 'dinner', dish: 'sambar', quantity: 4, unit: 'trays'},
        {date: getDateString(today, -1), meal: 'breakfast', dish: 'roti', quantity: 2, unit: 'trays'},
        {date: getDateString(today, -1), meal: 'lunch', dish: 'dal', quantity: 3, unit: 'trays'},
        {date: getDateString(today, -1), meal: 'dinner', dish: 'rice', quantity: 5, unit: 'trays'},
        {date: getDateString(today, 0), meal: 'breakfast', dish: 'roti', quantity: 2, unit: 'trays'},
        {date: getDateString(today, 0), meal: 'lunch', dish: 'rice', quantity: 4, unit: 'trays'},
    ];

    // Sample ratings data
    ratingsData = [
        {meal: 'breakfast', dish: 'roti', rating: 4, comments: 'Good texture', timestamp: new Date()},
        {meal: 'lunch', dish: 'rice', rating: 3, comments: 'Average taste', timestamp: new Date()},
        {meal: 'dinner', dish: 'dal', rating: 2, comments: 'Too salty', timestamp: new Date()},
        {meal: 'breakfast', dish: 'roti', rating: 5, comments: 'Perfect!', timestamp: new Date()},
        {meal: 'lunch', dish: 'sabzi', rating: 4, comments: 'Well cooked', timestamp: new Date()},
        {meal: 'dinner', dish: 'rice', rating: 3, comments: 'Could be better', timestamp: new Date()},
        {meal: 'breakfast', dish: 'roti', rating: 4, comments: 'Good', timestamp: new Date()},
        {meal: 'lunch', dish: 'dal', rating: 5, comments: 'Excellent taste', timestamp: new Date()},
    ];

    updateLeftovers();
    updateStats();
    updateDashboard();
    updateLeaderboard();
    createChart(currentChartType);
}

// Helper function to get date string
function getDateString(date, daysOffset) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + daysOffset);
    return newDate.toISOString().split('T')[0];
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    event.target.classList.add('active');
    
    // Update chart if dashboard is opened
    if (pageId === 'dashboard') {
        setTimeout(() => createChart(currentChartType), 100);
    }
}

// Chart functionality
function showChart(chartType) {
    currentChartType = chartType;
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    createChart(chartType);
}

function createChart(type) {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    switch (type) {
        case 'waste-trend':
            createWasteTrendChart(ctx);
            break;
        case 'dish-waste':
            createDishWasteChart(ctx);
            break;
        case 'meal-ratings':
            createMealRatingsChart(ctx);
            break;
        case 'hostel-comparison':
            createHostelComparisonChart(ctx);
            break;
    }
}

function createWasteTrendChart(ctx) {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        last7Days.push(getDateString(today, -i));
    }
    
    const dailyWaste = last7Days.map(date => {
        return wasteData
            .filter(item => item.date === date)
            .reduce((sum, item) => sum + item.quantity, 0);
    });
    
    const labels = last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Waste (trays)',
                data: dailyWaste,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Food Waste Trend (Last 7 Days)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantity (trays)'
                    }
                }
            }
        }
    });
}

function createDishWasteChart(ctx) {
    const dishWaste = {};
    wasteData.forEach(item => {
        dishWaste[item.dish] = (dishWaste[item.dish] || 0) + item.quantity;
    });
    
    const sortedDishes = Object.entries(dishWaste)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6);
    
    const labels = sortedDishes.map(([dish]) => dish.charAt(0).toUpperCase() + dish.slice(1));
    const data = sortedDishes.map(([,quantity]) => quantity);
    
    const colors = [
        '#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db', '#9b59b6'
    ];
    
    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Food Waste by Dish Type'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createMealRatingsChart(ctx) {
    const mealRatings = {};
    ratingsData.forEach(item => {
        if (!mealRatings[item.meal]) {
            mealRatings[item.meal] = [];
        }
        mealRatings[item.meal].push(item.rating);
    });
    
    const avgRatings = Object.entries(mealRatings).map(([meal, ratings]) => ({
        meal: meal.charAt(0).toUpperCase() + meal.slice(1),
        rating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    }));
    
    const labels = avgRatings.map(item => item.meal);
    const data = avgRatings.map(item => item.rating);
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Rating',
                data: data,
                backgroundColor: [
                    '#3498db',
                    '#27ae60',
                    '#f39c12'
                ],
                borderColor: [
                    '#2980b9',
                    '#229954',
                    '#e67e22'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Ratings by Meal'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Rating (1-5 stars)'
                    }
                }
            }
        }
    });
}

function createHostelComparisonChart(ctx) {
    const hostelData = hostels.map(hostel => ({
        name: hostel,
        waste: Math.floor(Math.random() * 50) + 20,
        efficiency: Math.floor(Math.random() * 30) + 70
    }));
    
    const labels = hostelData.map(item => item.name);
    const wasteData = hostelData.map(item => item.waste);
    const efficiencyData = hostelData.map(item => item.efficiency);
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Waste (kg)',
                    data: wasteData,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Efficiency Score',
                    data: efficiencyData,
                    backgroundColor: '#27ae60',
                    borderColor: '#229954',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Hostel Performance Comparison'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Waste (kg)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Efficiency Score'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Star rating functionality
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            updateStars(selectedRating);
        });

        star.addEventListener('mouseover', function() {
            updateStars(parseInt(this.dataset.rating));
        });
    });

    document.getElementById('star-rating').addEventListener('mouseleave', function() {
        updateStars(selectedRating);
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Set current date
    document.getElementById('waste-date').valueAsDate = new Date();
    
    // Initialize data
    initializeDummyData();
});

// Rating form submission
document.getElementById('rating-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const mealTime = document.getElementById('meal-time').value;
    const dishName = document.getElementById('dish-name').value;
    const rating = document.querySelectorAll('.star.active').length;
    const comments = document.getElementById('comments').value;

    if (rating === 0) {
        alert('Please select a rating');
        return;
    }

    ratingsData.push({
        meal: mealTime,
        dish: dishName,
        rating: rating,
        comments: comments,
        timestamp: new Date()
    });

    showSuccessMessage('Rating submitted successfully!');
    this.reset();
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    updateStats();
    updateDashboard();
    
    // Update chart if on dashboard
    if (document.getElementById('dashboard').classList.contains('active')) {
        createChart(currentChartType);
    }
});

// Waste form submission
document.getElementById('waste-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('waste-date').value;
    const meal = document.getElementById('waste-meal').value;
    const dish = document.getElementById('waste-dish').value;
    const quantity = parseFloat(document.getElementById('waste-quantity').value);
    const unit = document.getElementById('waste-unit').value;

    wasteData.push({
        date: date,
        meal: meal,
        dish: dish,
        quantity: quantity,
        unit: unit,
        timestamp: new Date()
    });

    showSuccessMessage('Waste logged successfully!');
    this.reset();
    document.getElementById('waste-date').valueAsDate = new Date();
    updateLeftovers();
    updateStats();
    updateDashboard();
    updateLeaderboard();
    
    // Update chart if on dashboard
    if (document.getElementById('dashboard').classList.contains('active')) {
        createChart(currentChartType);
    }
});

// Show success message
function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    const activeForm = document.querySelector('.page.active form');
    if (activeForm) {
        activeForm.parentNode.insertBefore(messageDiv, activeForm);
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

// Update leftovers display
function updateLeftovers() {
    const today = new Date().toISOString().split('T')[0];
    const todayWaste = wasteData.filter(item => item.date === today);
    
    const leftoversHtml = todayWaste.map(item => {
        const isUrgent = item.quantity >= 5;
        const timeAgo = getTimeAgo(item.timestamp);
        return `
            <div class="leftover-alert ${isUrgent ? 'urgent' : ''}">
                <h4>🍛 ${item.quantity} ${item.unit} of ${item.dish}</h4>
                <p>Available for collection at the canteen</p>
                <p><strong>Meal:</strong> ${item.meal} | <strong>Logged:</strong> ${timeAgo}</p>
                <button onclick="markAsTaken('${item.dish}', '${item.meal}', '${item.date}')">Mark as Taken</button>
            </div>
        `;
    }).join('');

    document.getElementById('leftovers-list').innerHTML = leftoversHtml || '<p>No leftovers available today. Great job reducing waste! 🎉</p>';
}

// Get time ago string
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else {
        return 'Today';
    }
}

// Mark leftover as taken
function markAsTaken(dish, meal, date) {
    const itemIndex = wasteData.findIndex(item => 
        item.date === date && item.dish === dish && item.meal === meal
    );
    
    if (itemIndex !== -1) {
        wasteData[itemIndex].quantity = Math.max(0, wasteData[itemIndex].quantity - 1);
        if (wasteData[itemIndex].quantity === 0) {
            wasteData.splice(itemIndex, 1);
        }
        updateLeftovers();
        updateStats();
        updateDashboard();
        
        // Update chart if on dashboard
        if (document.getElementById('dashboard').classList.contains('active')) {
            createChart(currentChartType);
        }
        
        showSuccessMessage('Marked as taken! Thanks for reducing waste! 🌱');
    }
}

// Update stats
function updateStats() {
    const totalWaste = wasteData.reduce((sum, item) => sum + item.quantity, 0);
    const mealsRated = ratingsData.length;
    const leftoversAvailable = wasteData.filter(item => 
        item.date === new Date().toISOString().split('T')[0]
    ).length;

    document.getElementById('total-waste').textContent = totalWaste;
    document.getElementById('meals-rated').textContent = mealsRated;
    document.getElementById('leftovers-available').textContent = leftoversAvailable;
}

// Update dashboard
function updateDashboard() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekWaste = wasteData
        .filter(item => new Date(item.date) >= weekAgo)
        .reduce((sum, item) => sum + item.quantity, 0);
    
    const avgRating = ratingsData.length > 0 ? 
        (ratingsData.reduce((sum, item) => sum + item.rating, 0) / ratingsData.length).toFixed(1) : 0;
    
    // Find most wasted dish
    const dishWaste = {};
    wasteData.forEach(item => {
        dishWaste[item.dish] = (dishWaste[item.dish] || 0) + item.quantity;
    });
    const mostWasted = Object.keys(dishWaste).length > 0 ? 
        Object.keys(dishWaste).reduce((a, b) => dishWaste[a] > dishWaste[b] ? a : b) : '-';

    document.getElementById('dash-total-waste').textContent = weekWaste;
    document.getElementById('dash-avg-rating').textContent = avgRating;
    document.getElementById('dash-worst-dish').textContent = mostWasted.charAt(0).toUpperCase() + mostWasted.slice(1);

    // Recent activity
    const recentActivity = [...wasteData, ...ratingsData]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(item => {
            const timeAgo = getTimeAgo(item.timestamp);
            if (item.quantity) {
                return `<p>🗑️ ${item.quantity} ${item.unit} of ${item.dish} wasted - ${timeAgo}</p>`;
            } else {
                return `<p>⭐ ${item.dish} rated ${item.rating} star${item.rating !== 1 ? 's' : ''} - ${timeAgo}</p>`;
            }
        }).join('');
    
    document.getElementById('recent-activity').innerHTML = recentActivity || '<p>No recent activity</p>';
}

// Update leaderboard
function updateLeaderboard() {
    const hostelWaste = hostels.map(hostel => ({
        name: hostel,
        waste: Math.floor(Math.random() * 50) + 10,
        score: Math.floor(Math.random() * 40) + 60,
        trend: Math.random() > 0.5 ? 'up' : 'down'
    })).sort((a, b) => a.waste - b.waste);

    const leaderboardHtml = hostelWaste.map((hostel, index) => {
        const trendIcon = hostel.trend === 'up' ? '📈' : '📉';
        const rankColor = index === 0 ? '#f39c12' : index === 1 ? '#95a5a6' : index === 2 ? '#cd7f32' : '#34495e';
        
        return `
            <div class="leaderboard-item">
                <div>
                    <span class="rank" style="color: ${rankColor}">#${index + 1}</span>
                    <strong>${hostel.name}</strong>
                    <span>${trendIcon}</span>
                </div>
                <div style="text-align: right;">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${hostel.score}%"></div>
                    </div>
                    <small>${hostel.waste}kg wasted | ${hostel.score}% efficiency</small>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('leaderboard-list').innerHTML = leaderboardHtml;
}