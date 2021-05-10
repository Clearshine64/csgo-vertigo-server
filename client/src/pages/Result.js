import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
  } from '@material-ui/core';
import AccountDetails from 'src/components/customs/AccountDetails'

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

const ResultList = (matchmode) => {
  const classes = useStyles();
  const [ accounts, setAccounts ] = useState([]);
  const [ page, setPage ] = useState(0);
  const [ limit, setLimit ] = useState(10);
  const [ accountFlag, setAccountFlag ] = useState('initial');

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleExport = () => {
    let str = '';
    accounts.map(item => {
      str = str.concat(item.username, '----', item.password, '\n');
      // str.concat(item.password, '\n');
    })
    const element = document.createElement("a");
    const file = new Blob([str], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "account.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const rankType = [
      'NON',
      'SILVER 1',
      'SILVER 2',
      'SILVER 3',
      'SILVER 4',
      'SIVER ELITE',
      'SILVER ELITE MASTER',
      'GOLD NOVA 1',
      'GOLD NOVA 2',
      'GOLD NOVA 3',
      'GOLD NOVA MASTER',
      'MASTER GUAROIAN 1',
      'MASTER GUAROIAN 2',
      'MASTER GUAROIAN ELITE',
      'DISTINGUISHED MASTER GUAROIAN',
      'LEGENDARY EAGLE',
      'LEGENDARY EAGLE MASTER',
      'SUPREME MASTER FIRST CLASS',
      'THE GLOVAL ELITE'
  ];

  useEffect(()=>{
    axios.get('/api/accounts/matchmode/' + matchmode.matchmode).then((data)=>{
      setAccounts(data.data.accounts.filter(obj => obj.status.flag === accountFlag));
    });
  }, [matchmode, accountFlag])

  return (
  <>
    <Helmet>
      <title>Account Management | Vertigo Boost</title>
    </Helmet>
    <Box
      sx={{
        marginLeft: 3,
        marginTop: 3,
    }}>
      <h2 style={{color: 'grey'}}>{matchmode.matchmode}</h2>
    </Box>
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: 3,
            marginTop: 3,
        }}
    >
        <FormControl fullwidth variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={accountFlag}
            onChange={(e) => setAccountFlag(e.target.value)}
            label="Status"
          >
              <MenuItem value={'initial'}>Initial</MenuItem>
              <MenuItem value={'useful'}>Useful</MenuItem>
              <MenuItem value={'notuseful'}>Not useful</MenuItem>
              <MenuItem value={'grouped'}>Grouped</MenuItem>
              <MenuItem value={'processed'}>Processed</MenuItem>
              <MenuItem value={'notprocessed'}>NotProcessed</MenuItem>
          </Select>
        </FormControl>
        <Button style={{marginLeft: '6px'}} variant="outlined" color="primary" onClick={handleExport}>
          Export
        </Button>
    </Box>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ pt: 3 }}>
          <Card>
            <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell sx={{height:8}}>
                          Username
                        </TableCell>
                        <TableCell>
                          Password
                        </TableCell>
                        <TableCell>
                          Level
                        </TableCell>
                        <TableCell>
                          Rank ID
                        </TableCell>
                        <TableCell>
                          Wins
                        </TableCell>
                        <TableCell>
                          Description
                        </TableCell>
                        <TableCell>
                          {/* View */}
                        </TableCell>
                    </TableRow> 
                    </TableHead>
                    <TableBody>
                    {accounts.slice(page * limit, Math.floor(accounts.length / limit) != page ? (page + 1) * limit : accounts.length).map((account) => (
                        <TableRow
                          hover
                          key={account._id}
                          >
                        <TableCell>
                          {account.username}
                        </TableCell>
                        <TableCell>
                            {account.password}
                        </TableCell>
                        <TableCell>
                            {account && account.profile_after && account.profile_after.player_level ? account.profile_after.player_level : 0}
                        </TableCell>
                        <TableCell>
                            {account && account.profile_after && account.profile_after.ranking && account.profile_after.ranking.rank_id && rankType && rankType[account.profile_after.ranking.rank_id] ? rankType[account.profile_after.ranking.rank_id] : 0}
                        </TableCell>
                        <TableCell>
                            {account && account.profile_after && account.profile_after.ranking && account.profile_after.ranking.wins ? account.profile_after.ranking.wins : 0}
                        </TableCell>
                        <TableCell>
                            {account.des}
                        </TableCell>
                        <TableCell>
                          <AccountDetails account={account}/>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={accounts.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 100, 500]}
            />
            </Card>
        </Box>
      </Container>
    </Box>
  </>
)};

export default ResultList;
