import React from 'react';

import {Box, Typography } from "@mui/material";
import ParcelFormModal from './ParcelFormModal';
import ParcelTable from './parcelTable';
import { useGetAllParcelsQuery } from '../../features/parcel/parcelApiSlice';



const Dashboard = () => {
  const {refetch}=useGetAllParcelsQuery();
    return(
        <Box>
            <Typography>Dashboard</Typography>
            <ParcelFormModal onParcelCreated={refetch}/>
            <ParcelTable/>
        
           
        </Box>
    )
};

export default Dashboard;
