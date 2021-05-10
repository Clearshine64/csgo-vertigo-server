import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import EventEmitter from 'reactjs-eventemitter';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField
} from '@material-ui/core';

axios.defaults.baseURL = "http://" + location.hostname + ":4000";

export default function AddClientDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [ip, setIP] = React.useState(props.client.clientip);
    const [groupNumber, setGroupNumber] = React.useState(props.client.capacity);
    const [err, setErr] = React.useState('');
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      setErr('');
      setIP(props.client.clientip);
      setGroupNumber('');
    };
    const handleSave = () => {
      if(ip == '')
      {
        setErr("IP field is empty!");
      }
      else if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip))
      {
        if(groupNumber == '')
        {
          setErr("Number of groups is not correct!");
          return;
        }
        if(groupNumber<0 || groupNumber>6) {
          setErr("Number of Groups must be between 0 and 6!");
          setGroupNumber('');
          return;
        }
        axios.put('/api/clients/'+props.client._id, {
          clientip: ip,
          capacity: groupNumber
        }).then(() => {
          setErr('');
          setIP(props.client.clientip);
          setGroupNumber('');
          setOpen(false);
          EventEmitter.dispatch('CLIENT_EVENT');
        }).catch((err) => {
          setErr(err.response.data.error);
        });
      }
      else
      {
        setErr("You have entered an invalid IP address!");
      }
    };

    return (
      <>
        <IconButton aria-label="edit" onClick={handleClickOpen}>
            <EditIcon />
        </IconButton>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit Client</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To Edit client, please enter IP and Number of Groups here.
            </DialogContentText>
            <span>IP address:</span>
            <TextField
              autoFocus
              margin="dense"
              id="ip"
              label="IP"
              type="text"
              value={ip}
              onChange={(e) => setIP(e.target.value)}
              fullWidth
            />
            <p></p>
            <span>Number of groups:</span>
            <TextField
              margin="dense"
              id="groupnumber"
              // label="Number of Groups"
              type="number"
              InputProps={{ inputProps: { min: "0", max: "6", step: "1" } }}
              value={groupNumber}
              onChange={(e) => setGroupNumber(e.target.value)}
              fullWidth
            />
            <p style={{color: 'red'}}>{err}</p>
          </DialogContent>
          <DialogActions>
            <Button margin="dense" variant="contained" color="primary" onClick={handleSave} >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
}