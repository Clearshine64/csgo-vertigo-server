import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import EventEmitter from 'reactjs-eventemitter';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import axios from 'axios';

axios.defaults.baseURL = "http://" + location.hostname + ":4000";

export default function ChangeAccountDialog({ account, ...props}) {
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState(account.username);
  const [password, setPassword] = React.useState(account.password);
  const [_id] = React.useState(account._id);

  const handleClickOpen = () => {
    setOpen(true);
    setUsername(account.username);
    setPassword(account.password);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    // setOpen(false);
    if (username !== '' && password !== '') {
      let url = '/api/accounts/' + _id.toString();
      axios.put(url, {
        username,
        password
      }).then((resp) => {
        setOpen(false);
        EventEmitter.dispatch('ADD_ACCOUNT');
      }).catch((err) => {
        alert(err.response.data.error);
      });
  }
  };

  return (
    <>
      <Tooltip title="Edit" arrow>
        <IconButton aria-label="edit" onClick={handleClickOpen}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Change account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To change account, please change username and password here.
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChange} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
