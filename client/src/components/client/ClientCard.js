import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-sweet-progress/lib/style.css";
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@material-ui/core';
import EditClientDialog from 'src/components/customs/EditClientDialog'
import EventEmitter from 'reactjs-eventemitter';
import axios from 'axios';

axios.defaults.baseURL = "http://" + location.hostname + "/node";

const ClientCard = ({
  client,
  handleSelect,
  index,
  ...rest
}) => {
  const handleDelete = () => {
    axios.delete('/api/clients/'+client._id).then( ()=> {
      EventEmitter.dispatch('CLIENT_EVENT');
    });
  }
  
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
      {...rest}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 1
          }}
        >
          {/* <Avatar
            alt="Client"
            src={client.useful === true ? '/static/images/products/connect.png' : '/static/images/products/disconnect.png'}
            variant="square"
          /> */}
          <h5 style={{ color: 'grey' }}>IP: {client.clientip}</h5>
        </Box>
        <Divider />
      </CardContent>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 1
          }}
        >
          <p>Number of groups can be run on this client: <span style={{fontSize: '20px'}}>{client.capacity}</span></p>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: 1
          }}
        >
          <EditClientDialog client={client}></EditClientDialog>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

ClientCard.propTypes = {
  product: PropTypes.object.isRequired,
  handleSelect: PropTypes.func,
  index: PropTypes.number.isRequired,
};

export default ClientCard;
