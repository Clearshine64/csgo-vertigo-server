/* Display Accounts State */
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  useTheme
} from '@material-ui/core';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import PersonIcon from '@material-ui/icons/Person';

const AccountState = (props) => {
  const theme = useTheme();
  const data = {
    datasets: [
      {
        data: [
          props.accounts.useful, 
          props.accounts.notuseful + props.accounts.notprocessed, 
          props.accounts.processed
        ],
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.green[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['useful', 'notuseful', 'processed']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Useful',
      value: props.accounts.useful == undefined ? 0 : props.accounts.useful,
      icon: HowToRegIcon,
      color: colors.indigo[500]
    },
    {
      title: 'Not useful',
      value: props.accounts.notuseful == undefined || props.accounts.notprocessed == undefined ? 0: props.accounts.notuseful + props.accounts.notprocessed,
      icon: PersonAddDisabledIcon,
      color: colors.red[600]
    },
    {
      title: 'Processed',
      value: props.accounts.processed == undefined ? 0 : props.accounts.processed,
      icon: PersonIcon,
      color: colors.green[600]
    }
  ];

  return (
    <Card>
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {devices.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h2"
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountState;
