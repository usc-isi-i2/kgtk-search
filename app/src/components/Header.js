import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import GitHubIcon from '@material-ui/icons/GitHub'
import { makeStyles } from '@material-ui/core/styles'

import Logo from './Logo'


const useStyles = makeStyles(theme => ({
  menuIcon: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}))


const Header = () => {

  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar>
        <div className={classes.menuIcon}>
          <a href="https://github.com/usc-isi-i2/kgtk"
            title="Knowledge Graph Toolkit"
            rel="noopener noreferrer nofollow"
            target="_blank">
            <Logo/>
          </a>
        </div>
        <Typography className={classes.title} variant="h6" noWrap>
          Knowledge Graph Text Search
        </Typography>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          <IconButton
            color="inherit"
            href="https://github.com/usc-isi-i2/kgtk"
            title="Knowledge Graph Toolkit"
            rel="noopener noreferrer nofollow"
            target="_blank">
            <GitHubIcon fontSize="large" />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )
}


export default Header
