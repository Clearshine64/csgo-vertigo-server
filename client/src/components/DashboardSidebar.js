import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ComputerIcon from '@material-ui/icons/Computer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Drawer,
  Hidden,
  List
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          <Accordion>
            <AccordionDetails>
              <NavItem
                href='/app/dashboard'
                key='Dashboard'
                title='Dashboard'
                icon={BarChartIcon}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <NavItem
                href='/app/acc_management'
                key='Account'
                title='Account'
                icon={UsersIcon}
              />
            </AccordionSummary>
            <AccordionDetails>
              <NavItem
                href='/app/acc_management/openrank'
                key='Open Rank'
                title='Open Rank'
              />
            </AccordionDetails>
            <AccordionDetails>
              <NavItem
                href='/app/acc_management/onlylose'
                key='Only lose'
                title='Only lose'
              />
            </AccordionDetails>
            <AccordionDetails>
              <NavItem
                href='/app/acc_management/level'
                key='level'
                title='level'
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionDetails>
              <NavItem
                href='/app/client'
                key='Client'
                title='Client'
                icon={ComputerIcon}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <NavItem
                href='/app/result'
                key='Result'
                title='Result'
                icon={DynamicFeedIcon}
              />
            </AccordionSummary>
            <AccordionDetails>
              <NavItem
                href='/app/result/openrank'
                key='Open Rank'
                title='Open Rank'
              />
            </AccordionDetails>
            <AccordionDetails>
              <NavItem
                href='/app/result/onlylose'
                key='Only lose'
                title='Only lose'
              />
            </AccordionDetails>
            <AccordionDetails>
              <NavItem
                href='/app/result/level'
                key='level'
                title='level'
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionDetails>
              <NavItem
                href='/app/match'
                key='Match'
                title='Match'
                icon={PlayCircleOutlineIcon}
              />
            </AccordionDetails>
          </Accordion>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default DashboardSidebar;
