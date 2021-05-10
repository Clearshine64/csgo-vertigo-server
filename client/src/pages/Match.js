import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Select
} from '@material-ui/core';
import axios from 'axios';

axios.defaults.baseURL = "http://" + location.hostname + "/node";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const MatchList = () => {
  const classes = useStyles();
  const [ orInfo, setOrInfo ] = useState([]);
  const [ olInfo, setOlInfo ] = useState([]);
  const [ lInfo, setLInfo ] = useState([]);

  const [ orMap, setOrMap ] = useState('');
  const [ olMap, setOlMap ] = useState('');
  const [ lMap, setLMap ] = useState('');

  const [ orStartFlag, setOrStartFlag ] = useState(false);
  const [ olStartFlag, setOlStartFlag ] = useState(false);
  const [ lStartFlag, setLStartFlag ] = useState(false);

  const [ olCondition, setOlCondition ] = useState();
  const [ lCondition, setLCondition ] = useState();

  // When click start button, send request for save data (map, condition)
  const handleOrStart = async () => {
    await axios.put('/api/match/matchmode/openrank', {
      map: orMap,
      condition: 0
    });
    await axios.put('/api/match/play/openrank', {
      flag: !orStartFlag
    });

    if(orStartFlag) setOrStartFlag(false);
    else setOrStartFlag(true);
  };
  const handleOlStart = async () => {
    await axios.put('/api/match/matchmode/onlylose', {
      map: olMap,
      condition: olCondition
    });
    await axios.put('/api/match/play/onlylose', {
      flag: !olStartFlag
    });

    if(olStartFlag) setOlStartFlag(false);
    else setOlStartFlag(true);
  };
  const handleLStart = async () => {
    
    await axios.put('/api/match/matchmode/level', {
      map: lMap,
      condition: lCondition
    });    
    await axios.put('/api/match/play/level', {
      flag: !lStartFlag
    });  

    if(lStartFlag) setLStartFlag(false);
    else setLStartFlag(true);
  };

  useEffect(async () => {
    await axios.get('/api/match/play/openrank').then((data)=>{
      setOrStartFlag(data.data);
    });
    await axios.get('/api/match/play/onlylose').then((data)=>{
      setOlStartFlag(data.data);
    });
    await axios.get('/api/match/play/level').then((data)=>{
      setLStartFlag(data.data);
    });
    await axios.get('/api/match/matchmode/openrank').then((data)=>{
      setOrInfo(data.data.match);
      setOrMap(data.data.match.matchInfo.map)
    });
    await axios.get('/api/match/matchmode/onlylose').then((data)=>{
      setOlInfo(data.data.match);
      setOlMap(data.data.match.matchInfo.map)
      setOlCondition(data.data.match.matchInfo.condition)
    });
    await axios.get('/api/match/matchmode/level').then((data)=>{
      setLInfo(data.data.match);
      setLMap(data.data.match.matchInfo.map)
      setLCondition(data.data.match.matchInfo.condition)
    });
  },[]);

  return (
    <>
      <Helmet>
        <title>Match | Vertigo Boost</title>
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
          minHeight: '100%',
          pb: 1 }}
          >
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
                  <Divider />
                  <br />
                  <h4 style={{textAlign: 'center'}}>Number of clients: {orInfo.clients}</h4>
                  <h4 style={{textAlign: 'center'}}>Number of accounts: {orInfo.accounts}</h4>
                </CardContent>
                <Divider />
                <CardContent>
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  pb: 12 }}
                >
                  </Box>
                </CardContent>
                <Divider />
                <CardContent>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 1 }}
                  >
                    <FormControl fullwidth variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Map</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={orMap}
                        // value={orInfo.matchInfo == [] ? orInfo.matchInfo.map : orMap}
                        onChange={(e) => setOrMap(e.target.value)}
                        label="Map"
                      >
                        {orInfo.maps != undefined ? orInfo.maps.map((item) => (
                          <MenuItem value={item}>{item}</MenuItem>
                        )) : null}
                      </Select>
                    </FormControl>
                    <Button style={{marginLeft: '5%'}} variant="outlined" color="primary" onClick={handleOrStart}>
                      {orStartFlag == false ? 'start' : 'stop'}
                    </Button>
                  </Box>
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
                  <Divider />
                  <br />
                  <h4 style={{textAlign: 'center'}}>Number of clients: {olInfo.clients}</h4>
                  <h4 style={{textAlign: 'center'}}>Number of accounts: {olInfo.accounts}</h4>
                </CardContent>
                <Divider />
                <CardContent>
                  <span>Number of Lose:</span>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="nLose"
                    // label="Number of lose"
                    type="text"
                    value={olCondition}
                    onChange={(e) => setOlCondition(e.target.value)}
                    fullWidth
                  />
                </CardContent>
                <Divider />
                <CardContent>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 1 }}
                  >
                    <FormControl fullwidth variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Map</InputLabel>
                      <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={olMap}
                      onChange={(e) => setOlMap(e.target.value)}
                      label="Map"
                      >
                        {olInfo.maps != undefined ? olInfo.maps.map((item) => (
                          <MenuItem value={item}>{item}</MenuItem>
                        )) : null}
                      </Select>
                    </FormControl>
                    <Button style={{marginLeft: '5%'}} variant="outlined" color="primary" onClick={handleOlStart}>
                      {olStartFlag == false ? 'start' : 'stop'}
                    </Button>
                  </Box>
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
                  <Divider />
                  <br />
                  <h4 style={{textAlign: 'center'}}>Number of clients: {lInfo.clients}</h4>
                  <h4 style={{textAlign: 'center'}}>Number of accounts: {lInfo.accounts}</h4>
                </CardContent>
                <Divider />
                <CardContent>
                  <span>Number of Cycle:</span>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="nLose"
                    // label="Number of Cycle"
                    type="text"
                    value={lCondition}
                    // value={lInfo.matchInfo == undefined ? [] : lInfo.matchInfo.condition}
                    onChange={(e) => setLCondition(e.target.value)}
                    fullWidth
                  />
                </CardContent>
                <Divider />
                <CardContent>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    pb: 1 }}
                  >
                    <FormControl fullwidth variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Map</InputLabel>
                      <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={lMap}
                      onChange={(e) => setLMap(e.target.value)}
                      label="Map"
                      >
                        {lInfo.maps != undefined ? lInfo.maps.map((item) => (
                          <MenuItem value={item}>{item}</MenuItem>
                        )) : null}
                      </Select>
                    </FormControl>
                    <Button style={{marginLeft: '5%'}} variant="outlined" color="primary" onClick={handleLStart}>
                      {lStartFlag == false ? 'start' : 'stop'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default MatchList;
