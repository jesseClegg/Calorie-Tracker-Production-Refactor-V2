import * as React from 'react';

import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import {Donut} from "../../Global Components/Donut";
import { useAuth } from "../../user-auth/contexts/AuthContexts";


import Box from '@mui/material/Box';

export default function DateRangePicker() {
    const [value, setValue] = React.useState([null, null]);
    const { currentUser } = useAuth();

    return (
        <>
           <div>
               <Donut email={currentUser.email} day={"2023-04-29T04:00:00.000Z"} />
           </div>

        <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateRangePicker
                displayStaticWrapperAs="desktop"
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
                renderInput={(startProps, endProps) => (
                    <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                    </React.Fragment>
                )}
            />

        </LocalizationProvider>
        </div>
        </>
    );
}
