import React, { Component } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

class Chart extends Component {
  state = {
    chartData: {
      labels: ["Facebook", "Instagram", "Twitter"],
      datasets: [
        {
          label: "Social Media Usage",
          data: [45, 35, 20],
          backgroundColor: ["#264653", "#E76F51", "#2A9D8F"],
        },
      ],
    },
  };
  render() {
    return (
      <div className="chart">
        <Doughnut data={this.props.data} height={this.props.height} />
      </div>
    );
  }
}

export default Chart;
