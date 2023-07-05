import React, { useEffect, useState } from "react";
import { useAuth } from "../../user-auth/contexts/AuthContexts";
import axios from "axios";
import NutritionList from "./NutritionList";
import AddFoodCard from "./AddFoodCard";
import CaloriesForOneDayWidget from '../../Global Components/CaloriesForOneDayWidget.js'
import {Donut} from "../../Global Components/Donut";
//import "../../Global Components/Chart-Page.css"
import "./Nutrition.css"



function getTodaysDate(date){
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date;
}

export default function Nutrition() {
    const { currentUser } = useAuth();
    const [foods, setFoods] = useState(null);
    const [wasModified, setWasModified] = useState(false);

    function modifyList() {
        setWasModified(true);
        // console.log("setting was modified to: "+wasModified);
    }

    useEffect(() => {
        console.log("inside useEffect, wasModified is: "+wasModified);
        getMeals(currentUser.email);
        setWasModified(false);
    }, [wasModified])

    function getMeals(userEmail) {
        axios
            .request({
                method: "POST",
                url: `http://localhost:3000/api/getAllFoods`,
                data: {
                    email: userEmail,
                },
            })
            .then(function (response) {
                setFoods(response.data);
            })
            .catch(function (error) {
                setFoods("error");
            });
    }
    return <div className="NutritionPageBody">
        {/*<Donut email={currentUser.email} day={"2023-04-29T04:00:00.000Z"}/>*/}
        {/*<Donut email={currentUser.email} day={getTodaysDate(new Date())}/>*/}
        <div className="topContainer">
            {/*<CaloriesForOneDayWidget className="oneDayWidget" />*/}
             <AddFoodCard className="addFoodCard"/>
        </div>

        <div className="NutritionListContainer">
            {foods && <NutritionList foods={foods}  modifyList = {modifyList}/>}
        </div>

    </div>;
}
