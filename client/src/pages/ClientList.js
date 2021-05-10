import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
// import ClientListToolbar from 'src/components/client/ClientListToolbar';
import ClientCard from 'src/components/client/ClientCard';
import AddClientDialog from 'src/components/customs/AddClientDialog'
import EventEmitter from 'reactjs-eventemitter';
import axios from 'axios';

axios.defaults.baseURL = "http://" + location.hostname + ":4000";

let setFlagtemp;
let flagtemp;

EventEmitter.subscribe('CLIENT_EVENT', () => {
  setFlagtemp(-flagtemp);
});

const ClientList = () => {
  const [ orclients, setOrClients ] = useState([]); // open rank clients
  const [ olclients, setOlClients ] = useState([]); // only lose clients
  const [ lvlclients, setLvlClients ] = useState([]); // level clients
  const [ flag, setFlag ] = useState(1); // eventEmitter flag
  
  setFlagtemp = setFlag;
  flagtemp = flag;

  useEffect(() => {
    axios.get('/api/clients/matchmode/openrank').then((data)=>{
        setOrClients(data.data.clients);
    });
    axios.get('/api/clients/matchmode/onlylose').then((data)=>{
        setOlClients(data.data.clients);
    });
    axios.get('/api/clients/matchmode/level').then((data)=>{
        setLvlClients(data.data.clients);
    });
  },[flag]);

  return (
    <>
      <Helmet>
        <title>Client Management | Vertigo Boost</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          pb: 1 }}
          >
          <AddClientDialog></AddClientDialog>
        </Box>
        <Container maxWidth={false}>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              lg={4}
              sm={12}
              xl={4}
              xs={12}
            >
              <Card>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 1 }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h4"
                    >
                      Open Rank
                    </Typography>
                  </Box>
                  {orclients.map((client, index) => (
                    <Box sx={{ pb: 1 }}>
                      <ClientCard client={client} index={index} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              lg={4}
              sm={12}
              xl={4}
              xs={12}
            >
              <Card>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 1 }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h4"
                    >
                      Only Lose
                    </Typography>
                  </Box>
                  {olclients.map((client, index) => (
                    <Box sx={{ pb: 1 }}>
                      <ClientCard client={client} index={index} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              lg={4}
              sm={12}
              xl={4}
              xs={12}
            >
              <Card>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 1 }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h4"
                    >
                      Level
                    </Typography>
                  </Box>
                  {lvlclients.map((client, index) => (
                    <Box sx={{ pb: 1 }}>
                      <ClientCard client={client} index={index} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ClientList;
