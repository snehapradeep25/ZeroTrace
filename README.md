# ZeroTrace
# 🍽️ Canteen Compass

**Track, Reduce & Reuse Food Waste**

A smart food waste management system designed for hostels and canteens to monitor, analyze, and reduce food waste through user engagement and data-driven insights.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Canteen Compass is a comprehensive web application that helps hostel and canteen management tackle food waste through:

- **Real-time waste tracking** - Log leftover food quantities
- **User feedback system** - Rate meals to improve food quality
- **Leftovers marketplace** - Share available food with the community
- **Analytics dashboard** - Visualize waste patterns and trends
- **Gamification** - Hostel leaderboard to encourage healthy competition

## ✨ Features

### 🏠 Home Dashboard
- Quick overview of total waste, meals rated, and available leftovers
- One-click access to all major features
- Real-time statistics display

### ⭐ Meal Rating System
- Rate meals on a 5-star scale
- Provide feedback comments
- Track meal satisfaction across breakfast, lunch, and dinner

### 📊 Waste Logging
- Record leftover food quantities by meal and dish type
- Support for multiple units (trays, plates, buckets, kg)
- Date-based tracking for historical analysis

### 🍛 Leftovers Marketplace
- View available leftover food in real-time
- Mark items as taken to update inventory
- Urgent alerts for large quantities

### 🏆 Hostel Leaderboard
- Competitive ranking system between hostels
- Waste reduction efficiency scores
- Trend indicators for performance tracking

### 📈 Analytics Dashboard
- **Waste Trend Analysis** - 7-day waste patterns
- **Dish-wise Breakdown** - Identify most wasted items
- **Meal Ratings Overview** - Average satisfaction scores
- **Hostel Comparison** - Performance metrics across hostels
- Recent activity feed
- 
## 🛠️ Installation
### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Quick Start

1. **Clone the repository**

2. **Open the application**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js
     npx http-server
     ```

3. **Access the application**
   - Direct: `file:///path/to/index.html`
   - Local server: `http://localhost:8000`

## 📖 Usage

### Getting Started

1. **Rate Your Meals**
   - Navigate to "Rate Food" tab
   - Select meal time and dish
   - Provide star rating and optional feedback

2. **Log Food Waste**
   - Go to "Log Waste" section
   - Enter date, meal details, and quantity
   - Submit to update waste tracking

3. **Check Leftovers**
   - Visit "Leftovers" tab to see available food
   - Mark items as taken when collected
   - Help reduce waste by sharing information

4. **View Analytics**
   - Access "Dashboard" for detailed insights
   - Switch between different chart views
   - Monitor trends and performance metrics

5. **Compete with Other Hostels**
   - Check "Leaderboard" for hostel rankings
   - See efficiency scores and waste metrics
   - Encourage healthy competition

### Sample Data

The application comes with sample data to demonstrate functionality:
- 7 days of waste tracking data
- Sample meal ratings across different dishes
- Mock hostel comparison data

## 📁 File Structure

```
canteen-compass/
├── index.html          # Main HTML structure
├── script.js           # JavaScript functionality
├── style.css          # CSS styling
└── README.md          # This file
```

### Key Components

- **index.html**: Complete HTML structure with all pages and forms
- **script.js**: Full JavaScript logic including:
  - Data management and storage
  - Chart generation (Chart.js)
  - Form handling and validation
  - Navigation and UI interactions
- **style.css**: Comprehensive styling with:
  - Modern, responsive design
  - Gradient backgrounds and smooth animations
  - Mobile-friendly layout
  - Accessibility considerations

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js 3.9.1
- **Styling**: Custom CSS with Flexbox and Grid
- **Icons**: Unicode emojis and custom styling
- **Data Storage**: Local JavaScript objects (no backend required)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add comments for complex functionality
- Test thoroughly across different browsers
- Ensure responsive design principles
- Update documentation as needed

## 📊 Future Enhancements

- [ ] Backend integration for data persistence
- [ ] User authentication and authorization
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced analytics and ML predictions
- [ ] Integration with inventory management systems
- [ ] Multi-language support
- [ ] Export functionality for reports

## 🐛 Known Issues

- Data resets on page refresh (no persistence)
- Limited to single-session use
- Charts may not display properly on very small screens

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chart.js for excellent charting library
- Modern web standards for responsive design
- Open source community for inspiration

## 📞 Support

If you have any questions or need help getting started:

- Create an issue on GitHub
- Contact: snehapradeep5943@gmail.com


---

**Made with ❤️ for a sustainable future**
