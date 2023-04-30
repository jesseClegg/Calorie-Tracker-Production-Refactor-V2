import Container from "@mui/material/Container";
import * as React from 'react';
import DateRangePicker from './DateRangePicker';
import Calendar from "./Calendar";
import CaloriesForOneDayWidget from "../../Global Components/CaloriesForOneDayWidget"
import { useAuth } from "../../user-auth/contexts/AuthContexts";
import {Donut} from "../../Global Components/Donut";


export function PastDatesPage() {
    const { currentUser } = useAuth();

    return <Container>Select a Past Date
        {/*<Donut email={currentUser.email} day={"2023-04-29T04:00:00.000Z"} />*/}
        <Calendar />

    </Container>

}
export default PastDatesPage;