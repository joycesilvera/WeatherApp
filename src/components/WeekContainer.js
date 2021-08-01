import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DayCard from "../components/DayCard";
import SearchBar from "./SearchBar";
import Header from "./Header";
import About from "./pages/About";
import { Link } from "react-router-dom";
import TodaysWeather from "./TodaysWeather";
import { Paper } from "@material-ui/core";
import leftArrow from "../icons/left-arrow.svg";
import rightArrow from "../icons/right-arrow.svg";
import { css, jsx } from "@emotion/core";
import styled from "styled-components";
var moment = require("moment");

const Error = styled.div`
  display: flex;
  margin-top: 15%;
  justify-content: center;
  text-align: center;
`;

class WeekContainer extends React.Component {
  state = {
    fullData: [],
    dailyData: [],
    minTempData: [],
    maxTempData: [],
    fields: { city: "" },
    currentWeather: {},
    currentTime: 12,
    showRightIcon: false,
    showLeftIcon: false,
    error: false,
    errorCity: "",
    showAllData: false,
    date: [],
    newDate: "",
    tempDate: "",
    compDate: "",
    minTempe: 999,
    highTempe: 0,
  };

  searchCity = (City) => {
    if (City !== undefined) {
      this.state.errorCity = City;
      console.log(City);
      const forecastURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        City +
        "&APPID=d124b828368ff3eca37193198120f888";

      const weatherURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        City +
        "&APPID=d124b828368ff3eca37193198120f888";

      fetch(forecastURL)
        .then((res) => res.json())
        .then((data) => {
          try {
            let newDate = new Date();

            const temp = moment(newDate).format("L");

            this.state.date = temp.split("/");
            this.state.newDate = this.state.date
              .join("-")
              .substring(0, 5)
              .toString();

            this.state.tempDate = Math.round(
              parseInt(this.state.newDate.substring(3, 5)) + 1
            );
            this.state.compDate =
              this.state.newDate.substring(0, 3) + this.state.tempDate;
            console.log("2020-" + this.state.compDate + " ");

            const dailyData = data.list.filter((reading) =>
              reading.dt_txt.includes("12:00:00")
            );
            const minTempData = data.list.filter((reading) =>
              reading.dt_txt.includes(
                "2020-" + this.state.compDate.toString() + " "
              )
            );
            this.state.minTempData = minTempData;
            this.state.maxTempData = minTempData;
            this.minTemp();
            this.highTemp();

            // this.state.minTempData = minTempData.main[0].temp_min;

            //console.log(minTempData[0].main.temp_min);

            this.state.currentTime = 12;
            this.state.showAllData = true;
            this.state.error = false;
            return fetch(weatherURL)
              .then((resp) => resp.json())
              .then((temp1) => {
                this.state.fields.city = temp1.name;
                const weatherInfo = {
                  city: temp1.name,
                  country: temp1.sys.country,
                  description: temp1.weather[0].description,
                  main: temp1.weather[0].main,
                  temp: temp1.main.temp,
                  temp_min: temp1.main.temp_min,
                  temp_max: temp1.main.temp_max,
                };

                this.setState(
                  {
                    fullData: data.list,
                    dailyData: dailyData,
                    city: this.state.city,
                    currentWeather: weatherInfo,
                  },
                  () => console.log(this.state)
                );
              });
          } catch (error) {
            console.error(error);
            this.state.error = true;
            this.state.showAllData = false;
            this.forceUpdate();
          }
        });
    }
  };

  minTemp = () => {
    for (var i = 0; i < this.state.minTempData.length; i++) {
      let e = this.state.minTempData[i].main.temp_min;
      if (e < this.state.minTempe) {
        this.state.minTempe = e;
      }
    }
    console.log("min temp is" + this.state.minTempe);
  };

  highTemp = () => {
    for (var i = 0; i < this.state.maxTempData.length; i++) {
      let e = this.state.maxTempData[i].main.temp_max;
      if (e > this.state.highTempe) {
        this.state.highTempe = e;
      }
    }
    console.log("high temp is" + this.state.minTempe);
  };

  Arrow = ({ direction, handleClick }) => (
    <div
      onClick={handleClick}
      css={css`
        display: flex;
        position: absolute;
        top: 50%;
        ${direction === "right" ? `right: 25px` : `left: 25px`};
        height: 50px;
        width: 50px;
        justify-content: center;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        align-items: center;
        transition: transform ease-in 0.1s;
        &:hover {
          transform: scale(1.1);
        }
        img {
          transform: translateX(${direction === "left" ? "-2" : "2"}px);
          &:focus {
            outline: 0;
          }
        }
      `}
    >
      {direction === "right" ? (
        <img src={rightArrow} />
      ) : (
        <img src={leftArrow} />
      )}
    </div>
  );

  formatDayCards = () => {
    return this.state.dailyData.map(
      (reading, index) => (
        (this.state.showLeftIcon = true),
        (this.state.showRightIcon = true),
        (<DayCard reading={reading} key={index} style={dayCardStyle} />)
        //this.forceUpdate()
      )
    );
  };

  formatCurrentWeather = () => {
    if (this.state.fields.city !== "") {
      return (
        <TodaysWeather
          city={this.state.fields.city}
          currentWeather={this.state.currentWeather}
        />
      );
    }
  };

  getLeftArrow = () => {
    if (this.state.showLeftIcon) {
      return <img src={leftArrow} direction="left" onClick={this.prevSlide} />;
    }
  };

  getRightArrow = () => {
    if (this.state.showRightIcon) {
      return (
        <img src={rightArrow} direction="right" onClick={this.nextSlide} />
      );
    }
  };

  showHeader = () => {
    if (this.state.fields.city !== "") {
      return <Header />;
    }
  };

  nextSlide = () => {
    if (this.state.currentTime <= 18) {
      const addTime = this.state.currentTime + 3;
      this.state.currentTime = addTime;
      console.log(this.state.currentTime);

      const forecast =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        this.state.fields.city +
        "&APPID=d124b828368ff3eca37193198120f888";

      fetch(forecast)
        .then((res) => res.json())
        .then((data) => {
          const dailyData = data.list.filter((reading) =>
            reading.dt_txt.includes(addTime + ":00:00")
          );
          this.setState(
            {
              fullData: data.list,
              dailyData: dailyData,
              city: this.state.city,
            },
            () => console.log(this.state)
          );
        });
    } else {
      console.log("first time");
      this.state.showRightIcon = false;
      this.getRightArrow();
    }
  };

  prevSlide = () => {
    if (this.state.currentTime >= 3) {
      console.log(this.state.currentTime);
      const subTime = this.state.currentTime - 3;
      this.state.currentTime = subTime;

      const forecast =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        this.state.fields.city +
        "&APPID=d124b828368ff3eca37193198120f888";

      fetch(forecast)
        .then((res) => res.json())
        .then((data) => {
          const dailyData = data.list.filter((reading) =>
            reading.dt_txt.includes(subTime + ":00:00")
          );
          this.setState(
            {
              fullData: data.list,
              dailyData: dailyData,
              city: this.state.city,
            },
            () => console.log(this.state)
          );
        });
    } else {
      console.log("first time");
      this.state.showIcon = false;
      this.forceUpdate();
    }
  };

  render() {
    const { currentWeather, city } = this.state;
    return (
      <Router>
        <div className="container">
          <div>
            <Paper
              elevation={3}
              style={{ marginTop: "5%", backgroundColor: "transparent" }}
            >
              <h1>Weather Application</h1>
              <h5>
                <Link to="/"> Home</Link> | <Link to="/about">About</Link>
              </h5>
            </Paper>
            <div className="controls">
              <Route
                exact
                path="/" //by adding EXACT here we get only the ABOUT page
                render={(props) => (
                  <React.Fragment>
                    <SearchBar
                      searchCity={this.searchCity}
                      onChange={this.onChange}
                    />
                  </React.Fragment>
                )}
              />
              <Route path="/about" component={About} />
            </div>
            {this.state.showAllData && (
              <div>
                <div className="row justify-content-center">
                  {this.formatCurrentWeather()}
                </div>
                <div className="row justify-content-center">
                  {this.getLeftArrow()}
                  {this.formatDayCards()}
                  {this.getRightArrow()}
                </div>
              </div>
            )}
          </div>
          {this.state.error && (
            <Error>
              There are no records for '{this.state.errorCity}', make sure that
              you have spelled the City Name correctly.
            </Error>
          )}
        </div>
      </Router>
    );
  }
}

const dayCardStyle = {
  marginTop: "5%",
};

const headerStyle = {
  background: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "10px",
};
export default WeekContainer;
