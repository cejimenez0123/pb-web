import * as React from 'react';
import {Skeleton }from '@mui/material';
import Stack from '@mui/material/Stack';
import "../App.css"
function PageSkeleton(props){

    return(<div ><div className='page-skeleton'>
        <Stack spacing={1}>
        <Skeleton className='header' variant="rectangular" />
        <Skeleton className='body' variant="rectangular" />
        <Skeleton className='footer' variant="rectangular" />
        </Stack>
    </div></div>)
}
export default PageSkeleton