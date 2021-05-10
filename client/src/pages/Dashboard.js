import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';
import AccountState from 'src/components/dashboard/AccountState';
import ClientState from 'src/components/dashboard/ClientState';
import MatchState from 'src/components/dashboard/MatchState';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import response from './response';

var HOST = "ws://" + location.hostname + "/ws/socket/browser"

var ws = new WebSocket(HOST);

const Dashboard = () => {
  const [ orClients, setOrClients ] = useState([]);
  const [ orAccounts, setOrAccounts ] = useState([]);
  const [ orMatch, setOrMatch ] = useState([]);

  const [ olClients, setOlClients ] = useState([]);
  const [ olAccounts, setOlAccounts ] = useState([]);
  const [ olMatch, setOlMatch ] = useState([]);

  const [ lClients, setLClients ] = useState([]);
  const [ lAccounts, setLAccounts ] = useState([]);
  const [ lMatch, setLMatch ] = useState([]);
  
  /* test case */
  // useEffect(() => {
  //   setOrClients(response.openrank.clients);
  //   setOrAccounts(response.openrank.accounts);
  //   setOrMatch(response.openrank.matches);

  //   setOlClients(response.onlylose.clients);
  //   setOlAccounts(response.onlylose.accounts);
  //   setOlMatch(response.onlylose.matches);

  //   setLClients(response.level.clients);
  //   setLAccounts(response.level.accounts);
  //   setLMatch(response.level.matches);
  // },[]);

  /* get data from ws */
  (function() {
    ws.onmessage = function(msg) {
      var response = JSON.parse(msg.data);
      setOrClients(response.openrank.clients);
      setOrAccounts(response.openrank.accounts);
      setOrMatch(response.openrank.matches);

      setOlClients(response.onlylose.clients);
      setOlAccounts(response.onlylose.accounts);
      setOlMatch(response.onlylose.matches);

      setLClients(response.level.clients);
      setLAccounts(response.level.accounts);
      setLMatch(response.level.matches);
    }
  }());

  const [openrankFlag, setOpenrankFlag] = useState(1);
  const [onlyloseFlag, setOnlyloseFlag] = useState(1);
  const [levelFlag, setLevelFlag] = useState(1);
  return (
    <>
      <Helmet>
        <title>Dashboard | Vertigo Boost</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
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
                  <Accordion expanded={openrankFlag === 1} onChange={(event) => {setOpenrankFlag(-openrankFlag)}}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Accounts State
                    </AccordionSummary>
                    <AccordionDetails>
                      <AccountState accounts={orAccounts}></AccountState>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Clients State
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          marginTop: 2
                        }}
                      >
                        <Divider />
                        <CardContent>
                          {orClients.map(client => (
                            <ClientState client={client}></ClientState>
                          ))}
                        </CardContent>
                      </Card>
                    </AccordionDetails>
                  </Accordion>
                  {/* <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Current Matches
                    </AccordionSummary>
                    <AccordionDetails>
                      <MatchState match={orMatch}></MatchState>
                    </AccordionDetails>
                  </Accordion> */}
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
                  <Accordion expanded={onlyloseFlag === 1} onChange={(event) => {setOnlyloseFlag(-onlyloseFlag)}}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Accounts State
                    </AccordionSummary>
                    <AccordionDetails>
                      <AccountState accounts={olAccounts}></AccountState>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Clients State
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          marginTop: 2
                        }}
                      >
                        <Divider />
                        <CardContent>
                          {olClients.map(client => (
                            <ClientState client={client}></ClientState>
                          ))}
                        </CardContent>
                      </Card>
                    </AccordionDetails>
                  </Accordion>
                  {/* <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Current Matches
                    </AccordionSummary>
                    <AccordionDetails>
                      <MatchState match={olMatch}></MatchState>
                    </AccordionDetails>
                  </Accordion> */}
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
                  <Accordion expanded={levelFlag === 1} onChange={(event) => {setLevelFlag(-levelFlag)}}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Accounts State
                    </AccordionSummary>
                    <AccordionDetails>
                      <AccountState accounts={lAccounts}></AccountState>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Clients State
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          marginTop: 2
                        }}
                      >
                        <Divider />
                        <CardContent>
                          {lClients.map(client => (
                            <ClientState client={client}></ClientState>
                          ))}
                        </CardContent>
                      </Card>
                    </AccordionDetails>
                  </Accordion>
                  {/* <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Current Matches
                    </AccordionSummary>
                    <AccordionDetails>
                      <MatchState match={lMatch}></MatchState>
                    </AccordionDetails>
                  </Accordion> */}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default Dashboard;
