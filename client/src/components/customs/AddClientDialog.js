import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import EventEmitter from 'reactjs-eventemitter';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    TextField,
    Select
} from '@material-ui/core';

axios.defaults.baseURL = "http://" + location.hostname + ":4000";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));

export default function AddClientDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [matchmode, setMatchMode] = React.useState('openrank');
    const [ip, setIP] = React.useState('');
    const [groupNumber, setGroupNumber] = React.useState('');
    const [err, setErr] = React.useState('');
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setErr('');
      setIP('');
      setGroupNumber('');
    };
    
    const handleAdd = () => {
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
          setErr("Number of Groups must be between 0 and 6");
          setGroupNumber('');
          return;
        }
        axios.post('/api/clients', {
            matchmode: matchmode,
            clientip: ip,
            capacity: groupNumber
        }).then(() => {
          setErr('');
          setIP('');
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
      <div>
        <Button margin="dense" variant="contained" color="primary" onClick={handleClickOpen} >
          Add
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Client</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add client, please enter IP and Number of Groups here.
            </DialogContentText>
            <FormControl fullwidth variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Match Mode</InputLabel>
                <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={matchmode}
                onChange={(e) => setMatchMode(e.target.value)}
                label="Match Mode"
                >
                    <MenuItem value={'openrank'}>Open Rank</MenuItem>
                    <MenuItem value={'onlylose'}>Only Lose</MenuItem>
                    <MenuItem value={'level'}>Level</MenuItem>
                </Select>
            </FormControl>
            <p></p>
            <span>IP address: </span>
            <TextField
              autoFocus
              margin="dense"
              id="ip"
              // label="IP"
              type="text"
              value={ip}
              onChange={(e) => setIP(e.target.value)}
              fullWidth
            />
            <span>Number of groups: </span>
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
            <Button margin="dense" variant="contained" color="primary" onClick={handleAdd} >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}