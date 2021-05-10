import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EventEmitter from 'reactjs-eventemitter';
import axios from 'axios';

axios.defaults.baseURL = "http://" + location.hostname + ":4000";

export default function AddAccountDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [ err, setErr] = useState('')
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErr('');
    setUsername('');
    setPassword('');
  };
  const handleAdd = () => {
    if(username == '' || password == '')
    {
      setErr('Username or Password is empty!');
      return;  
    }
    axios.post('/api/accounts', {
      username,
      password,
      matchmode: props.matchmode.matchmode
    }).then((resp) => {
      setUsername('');
      setPassword('');
      setOpen(false);
      setErr('');
      sleep(100).then(r => {
        EventEmitter.dispatch('ADD_ACCOUNT');
      })
    }).catch((error) => {
      console.log(error);
      setErr(error.response.data.error);
    });
  };

  return (
    <div>
      <Button margin="dense" variant="outlined" color="primary" onClick={handleClickOpen}>
        Add
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add account, please enter username and password here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <p style={{color: 'red'}}>{err}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
