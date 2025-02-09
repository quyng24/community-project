//animation text
const fadeOnScroll = (selector, speed = 300, translateY = 50) => {
    document.addEventListener("scroll", function () {
      let elements = document.querySelectorAll(selector);
  
      elements.forEach((element) => {
        let scrollPosition = window.scrollY;
        let opacityValue = Math.max(1 - scrollPosition / speed, 0);
        let translateValue = Math.min(scrollPosition / 2, translateY);
  
        element.style.opacity = opacityValue;
        element.style.transform = `translateY(${translateValue}px)`;
      });
    });
  }
fadeOnScroll(".section3__content", 400, 50);


// create chart
const API_KEY = "efac9b6e14c1fa5df7b60d872c482c41"; // 🔹 Thay bằng API Key của bạn
    const lat = 21.0285; // Hà Nội
    const lon = 105.8542;

    let pollutionChart;

    async function fetchPollutionData() {
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            const components = data.list[0].components; // Lấy dữ liệu về các chất ô nhiễm

            return {
                labels: ["CO (Carbon Monoxide)", "NO (Nitric Oxide)", "NO2 (Nitrogen Dioxide)", "O3 (Ozone)", "PM10", "PM2.5", "SO2 (Sulfur Dioxide)"],
                data: [
                    components.co / 10, 
                    components.no, 
                    components.no2, 
                    components.o3 / 10, 
                    components.pm10, 
                    components.pm2_5, 
                    components.so2
                ]
            };
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu API:", error);
            return null;
        }
    }

    async function updateChart() {
        const pollutionData = await fetchPollutionData();
        if (!pollutionData) return;

        const ctx = document.getElementById("pollutionChart").getContext("2d");

        if (pollutionChart) {
            pollutionChart.destroy(); // 🔹 Xóa biểu đồ cũ để cập nhật mới
        }

        pollutionChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: pollutionData.labels,
                datasets: [{
                    label: "Tác nhân ô nhiễm không khí",
                    data: pollutionData.data,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#8D6E63", "#4CAF50"],
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw.toFixed(1)} µg/m³`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateChart();
    setInterval(updateChart, 10 * 60 * 1000); //


//animation left, right
const animationEl = document.getElementsByClassName('box');
const isElInWindow = el => {
  const rect = el.getClientRects()[0];
  const heightScreen = window.innerHeight;
  if (!(rect.bottom < 0 || rect.top > heightScreen)) {
    el.classList.add('visible');
  } else {
    el.classList.remove('visible');
  }
};
const checkAnimation = () => {
  [...animationEl].forEach(item => {
    isElInWindow(item);
  });
}
window.onscroll = checkAnimation;