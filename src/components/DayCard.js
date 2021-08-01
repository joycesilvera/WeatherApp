import React from "react";
var moment = require("moment");
//import "../css";

const DayCard = ({ reading, degreeType }) => {
  let newDate = new Date();
  const weekday = reading.dt * 1000;
  newDate.setTime(weekday);
  console.log("low" + reading.main.temp);
  console.log("low" + reading.main.temp_min);
  console.log("high" + reading.main.temp_max);
  console.log("high" + reading.main.pressure);

  const lowCelsius = Math.round(reading.main.temp_min - 273);
  const lowFahrenheit = Math.round(32 + (lowCelsius * 9) / 5);

  const highCelsius = Math.round(reading.main.temp_max - 273);
  const highFahrenheit = Math.round(32 + (highCelsius * 9) / 5);

  console.log("low temp");
  const imgURL = `owf owf-${reading.weather[0].id} owf-5x`;

  return (
    <div className="col-sm-2">
      <div
        className="card"
        style={{ backgroundColor: "rgba(52, 52, 52, alpha)", opacity: "0.7" }}
      >
        <h3 className="card-title">{moment(newDate).format("dddd")}</h3>
        <p className="text-muted">
          {moment(newDate).format("MMMM Do, h:mm a")}
        </p>
        <i className={imgURL}></i>

        <h2>
          {degreeType === "celsius"
            ? lowCelsius + "°C"
            : "Low: " + lowFahrenheit + "°F"}
        </h2>
        <div />
        <h2>
          {degreeType === "celsius"
            ? highCelsius + "°C"
            : "High: " + highFahrenheit + "°F"}
        </h2>

        <div className="card-body">
          <p className="card-text" style={descStyle}>
            {reading.weather[0].description}
          </p>
        </div>
      </div>
    </div>
  );
};

const descStyle = {
  fontSize: "12px",
};

export default DayCard;
