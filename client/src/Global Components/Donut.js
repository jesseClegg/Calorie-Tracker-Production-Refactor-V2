import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from "axios";
import "./GlobalComponents.css"

ChartJS.register(ArcElement, Tooltip, Legend);


export function Donut(props) {
    const [email, setEmail] = useState(props.email);
    const [day, setDay]= useState(props.day);

    const [goalCalories, setGoalCalories] = useState(0);
    const [todayCalories, setTodayCalories] = useState(0);

    const dataProp = {
        labels: ['Total Daily Goal', 'Net Calories Today'],
        datasets: [
            {
                label: 'Calories',
                data: [goalCalories, todayCalories],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.75)', //blue || green
                    'rgba(255, 99, 132, 0.75)', //red
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', //blue || green
                    'rgba(255, 99, 132, 1)', //red
                ],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        function getDay(dateSelected){
            axios
                .request({
                    method: "POST",
                    url: `http://localhost:3000/api/getOneDay`,
                    data: {
                        email: email,
                        day: day
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
                        setGoalCalories(caloriesIn);
                        setTodayCalories(caloriesOut);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        // setChartData(dataProp)
        console.log("props dat= "+props.day)
        getDay(day)
        console.log("goal cals="+goalCalories)
        console.log("today cals= "+todayCalories)
    }, [goalCalories, todayCalories, email, day]);


    return <>
        {dataProp?<Doughnut className="Donut" data={dataProp} />: null}
         </>;
}
