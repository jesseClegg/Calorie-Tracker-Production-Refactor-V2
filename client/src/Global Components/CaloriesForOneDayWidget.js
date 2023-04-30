// import {useAuth} from "../user-auth/contexts/AuthContexts";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {format} from "date-fns";
import DayCard from "./DayCard";
// import { useAuth } from "../../user-auth/contexts/AuthContexts";
import {Donut} from "./Donut";
import "./GlobalComponents.css"

export default function Calendar(props) {
    // const today=getTodaysDate(new Date());
    // const today=props.day;
    const [today, setToday] = useState(props.day)
    const [selected, setSelected] = useState(new Date());
    // const { currentUser } = useAuth();
    const [day, setDay]= useState(null);
    const [netCalories, setNetCalories] = useState(0);

    function getTodaysDate(date){
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        return date;
    }

    useEffect( () => {
        console.log('today c41d='+today)
        function getDay(dateSelected){
            axios
                .request({
                    method: "POST",
                    url: `http://localhost:3000/api/getOneDay`,
                    data: {
                        //email: currentUser.email,
                        email: "jc7464@aol.com",
                        day: today
                    },
                })
                .then(function (response) {
                    if(!response.data){
                        console.log("no results for this day :(")
                    }else{
                        let caloriesIn=response.data.caloriesIn
                        let caloriesOut=response.data.caloriesOut

                        if(!response){
                            caloriesIn=0;
                            caloriesOut=0;
                        }
                        //todo: right here we have the data

                    }
                })
                .catch(function (error) {
                    // setActivities("error");
                });
        }
        getDay(selected)
    }, [selected, today]);

    let footer = <p>Please pick a day.</p>;
    if(day)
        footer= <p>results are: {day.caloriesIn} </p>
    if (selected)
        footer = <p>You picked {format(selected, 'PP')}.</p>;


    return (

        <h1 className="oneDayWidget">
            {/*Your net calories today: {netCalories}*/}
            <DayCard CaloriesIn={netCalories} />
            <Donut email={"jc7464@aol.com"} day={"2023-04-29T04:00:00.000Z"} />
        </h1>

    );
}