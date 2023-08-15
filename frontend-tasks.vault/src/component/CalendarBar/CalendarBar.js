import React, { useState, useEffect } from "react";
import "./CalendarBar.css";
import {AiOutlineClockCircle} from "react-icons/ai";


const CalendarBar = () => {
    const [currentDateTime, setCurrentDateTime] = useState(getFormattedDateTime);
  
    function getFormattedDateTime() {
      const date = new Date();
      const day = date.getDate();
      let month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const day_interval = hour >= 12 ? "PM" : "AM";
  
      switch (month) {
        case 1:
          month = "JAN";
          break;
        case 2:
          month = "FEB";
          break;
        case 3:
          month = "MAR";
          break;
        case 4:
          month = "APR";
          break;
        case 5:
          month = "MAY";
          break;
        case 6:
          month = "JUN";
          break;
        case 7:
          month = "JUL";
          break;
        case 8:
          month = "AUG";
          break;
        case 9:
          month = "SEPT";
          break;
        case 10:
          month = "OCT";
          break;
        case 11:
          month = "NOV";
          break;
        case 12:
          month = "DEC";
          break;
        default:
          break;
      }
  
      const currentDate = `${day} ${month}, ${year}`;
      const currentTime = `${hour}:${minute}:${seconds} ${day_interval}`;
  
      return { currentDate, currentTime };
    }
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDateTime(getFormattedDateTime());
      }, 1000); // Update every 1000ms (1 second)
  
      return () => clearInterval(intervalId); // Cleanup the interval on unmounting
    }, []);
  
    return ( 
        <div className="calendar-bar">
           <div className="clock-icon">
                <AiOutlineClockCircle size={25}/>
           </div>
           <div className="date-time-bar">
                {currentDateTime.currentDate}
                <br />
                {currentDateTime.currentTime}
           </div>
        </div>
     );
}
 
export default CalendarBar;