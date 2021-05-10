import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Button,
  Tooltip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import ChangeAccountDialog from '../customs/ChangeAccountDialog'
import EventEmitter from 'reactjs-eventemitter';

axios.defaults.baseURL = "http://" + location.hostname + "/node";

const AccountListResults = ({ accounts, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [batch, setBatch] = useState(0);
  const [wait, setWait] = useState(false);

  const checkBatch = (num) => {
    if (num !== 0) {
      setBatch(1);
    } else {
      setBatch(0);
    }
  };

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = accounts.map((account) => account._id);
    } else {
      newSelectedCustomerIds = [];
    }

    checkBatch(newSelectedCustomerIds.length);
    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    checkBatch(newSelectedCustomerIds.length);
    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteOne = (customerId) => {
    let url = '/api/accounts/' + customerId.toString();
    axios.delete(url);
    let temp = selectedCustomerIds.filter((id) => id != customerId);
    setSelectedCustomerIds(temp);
    checkBatch(temp.length)
    EventEmitter.dispatch('ADD_ACCOUNT');
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleDeleteBatch = async () => {
    // for (let i=0; i<selectedCustomerIds.length; i++)
    // {
    //   await axios.delete('/api/accounts/' + selectedCustomerIds[i].toString());
    //   if(i % 200 == 0) EventEmitter.dispatch('ADD_ACCOUNT');
    // }
    setWait(true);
    let temp = [];
    for(let i=0; i<selectedCustomerIds.length; i++) {
      temp.push(selectedCustomerIds[i]);
      if(i % 1000 == 0)
      {
        await axios.post('/api/accounts/deleteall', {
          data: temp
        });
        temp = [];
      }
    }
    await axios.post('/api/accounts/deleteall', {
      data: temp
    });
    setWait(false);

    setSelectedCustomerIds([]);
    checkBatch(0);
    // sleep(200).then(r => {
      EventEmitter.dispatch('ADD_ACCOUNT');
    // })
  }
  
  return (
    <Card {...rest}>
      <p style={{color: 'red'}}>{wait == false ? '' : 'Please wait...'}</p>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <div style={{
                position:'absolute', 
                backgroundColor: 'white', 
                marginTop: 7, 
                paddingLeft: 4, 
                paddingRight: 4, 
                width: '100%', 
                zIndex: ( batch===0 ) ? -1 : 2 , 
                display: 'flex'
              }}
          >
                <Checkbox
                      checked={selectedCustomerIds.length === accounts.length}
                      color="primary"
                      indeterminate={
                        selectedCustomerIds.length > 0
                        && selectedCustomerIds.length < accounts.length
                      }
                      onChange={handleSelectAll}
                    />
                <Button onClick={handleDeleteBatch}>Delete</Button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" width="5%">
                  <Checkbox
                    checked={selectedCustomerIds.length === accounts.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < accounts.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{height:8}} width="30%">
                  Username
                </TableCell>
                <TableCell width="30%">
                  Password
                </TableCell>
                <TableCell width="10%">
                  Description
                </TableCell>
                <TableCell width="25%">
                  Actions
                </TableCell>
              </TableRow> 
            </TableHead>
            <TableBody>
              {accounts.slice(page * limit, Math.floor(accounts.length / limit) != page ? (page + 1) * limit : accounts.length).map((account) => (
                <TableRow
                  hover
                  key={account._id}
                  selected={selectedCustomerIds.indexOf(account._id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(account._id) !== -1}
                      onChange={(event) => handleSelectOne(event, account._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      {/* <Avatar
                        src='/static/images/products/connect.png'
                        sx={{ mr: 2 }}
                      >
                      </Avatar> */}
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {account.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {account.password}
                  </TableCell>
                  <TableCell>
                    {account.lvl}
                  </TableCell>
                  <TableCell>
                    <ChangeAccountDialog account={account} />
                    {/* <AccountDetails account={account}/> */}
                    <Tooltip title="Delete" arrow>
                      <IconButton aria-label="delete" onClick={() => handleDeleteOne(account._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
  );
};

AccountListResults.propTypes = {
  accounts: PropTypes.array.isRequired
};

export default AccountListResults;
