import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';

const ClientState = ({client}) => {
  const percent = client.res.totalRam == 0 ? 0 : ((client.res.totalRam - client.res.availableRam) / client.res.totalRam * 100).toFixed(2);
  
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Divider />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            pb: 1
          }}
        >
          <h5 style={{ color: client.useful === true ? 'lightgreen' : 'grey' }}>IP: {client.clientip}</h5>
        </Box>
        <Divider />
        <br />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <Typography
            align="center"
            color="blue"
            gutterBottom
            variant="p"
          >
            {'CPU Usage'}
          </Typography>
          <Typography
            align="center"
            color="black"
            gutterBottom
            variant="h4"
          >
            <Progress
              type="circle"
              width={90}
              percent={client.res.cpu.toFixed(2)}
            />
          </Typography>
          <Typography
            align="center"
            color="black"
            gutterBottom
            variant="h4"
            width="10%"
          >
          </Typography>
          <div>
            <Typography
              align="center"
              color="lightgreen"
              gutterBottom
              variant="h4"
            >
              {'RAM Usage'}
            </Typography>
            <span style={{color: 'lightblue'}}>
              {'Total Memory(MiB):'}
              {client.res.totalRam}
            </span>
            <span style={{color: 'lightgrey'}}>
              {' Available Memory(MiB):'}
              {client.res.availableRam}
            </span>
            <ProgressBar animated variant="success" now={percent} label={`${percent}%`} />
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClientState;
