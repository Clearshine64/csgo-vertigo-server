import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import AccountListResults from 'src/components/account/AccountListResults';
import AccountListToolbar from 'src/components/account/AccountListToolbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import accounts from '../__mocks__/customers'
import EventEmitter from 'reactjs-eventemitter';

axios.defaults.baseURL = "http://" + location.hostname + "/node";

let setFlagtemp;
let flagtemp;

EventEmitter.subscribe('ADD_ACCOUNT', () => {
  setFlagtemp(-flagtemp);
});

const AccountList = (matchmode) => {
  const [ accounts, setAccounts ] = useState([]);
  const [ flag, setFlag ] = useState(1);
  
  setFlagtemp = setFlag;
  flagtemp = flag;
  
  useEffect(()=>{
    axios.get('/api/accounts/matchmode/' + matchmode.matchmode).then((data)=>{
      setAccounts(data.data.accounts);
    });
  },[flag, matchmode]);

  


  return (
  <>
    <Helmet>
      <title>Account Management | Vertigo Boost</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <AccountListToolbar matchmode={ matchmode } />
        <Box sx={{ pt: 3 }}>
          <AccountListResults accounts={ accounts } />
        </Box>
      </Container>
    </Box>
  </>
)};

export default AccountList;
