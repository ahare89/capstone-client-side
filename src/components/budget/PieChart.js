import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const PieChart = ({chartData, chartColors}) => {
    return (
        <Doughnut
        className="container-fluid"
        style={{ width: "1000px" }}          
            data={{
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: chartColors
                }]
            }}
            options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                  },
                  title: {
                    display: true,
                    text: 'Expenses Breakdown'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        var label = context.label || '';
              
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed !== null) {
                          label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                        }
                        return label;
                      }
                    }
                  }
                }
              }}
        />
    );
};







