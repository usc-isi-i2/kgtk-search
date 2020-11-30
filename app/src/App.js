import React from 'react'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles'

import Input from './components/Input'



let theme = createMuiTheme()
theme = responsiveFontSizes(theme)


const styles = theme => ({
  '@global': {
    body: {
      background: 'linear-gradient(150deg, #708090, #002133)',
      backgroundAttachment: 'fixed',
      backgroundSize: '100% 150%',
      padding: theme.spacing(3, 1),
      height: '100vh',
    },
  },
  header: {
    color: '#fefefe',
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(6),
    backgroundColor: 'rgba(254, 254, 254, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  button: {
    color: 'white',
    borderColor: 'whitesmoke',
    marginTop: theme.spacing(3),
  },
  underlined: {
    textDecoration: 'underline',
  },
  result: {
    position: 'relative',
    marginTop: theme.spacing(3),
  },
  index: {
    color: '#fefefe',
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
  link: {
    width: '100%',
    display: 'inline-block',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(5),
    color: '#fefefe',
    transition: '0.2s background ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
  label: {
    color: '#fefefe',
    textDecoration: 'underline',
  },
  description: {
    color: '#fefefe',
    textDecoration: 'none',
  },
})


class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      query: '',
      results: [],
    }
  }

  handleOnChange(query) {
    this.setState({query})
  }

  submit(event) {
    event.preventDefault()
    const { query } = this.state
    return fetch(`/search/${query}?extra_info=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((results) => {
      this.setState({results})
    })
  }

  renderResults() {
    const { classes } = this.props
    const { results } = this.state
    return results.map((result, i) => (
      <Grid item xs={12} key={i}
        className={classes.result}>
        <Typography
          component="h5"
          variant="h5"
          className={classes.index}>
          {i+1}.
        </Typography>
        <Link
          href={`https://sqid.toolforge.org/#/view?id=${result.qnode}`}
          target="_blank"
          className={classes.link}>
          <Typography
            component="h5"
            variant="h5"
            className={classes.label}>
            {result.label[0]} ({result.qnode})
          </Typography>
          <Typography
            component="p"
            variant="body1"
            className={classes.description}>
            {result.description[0]}
          </Typography>
          {!!result.alias.length ? (
            <Typography
              component="span"
              variant="body1"
              className={classes.description}>
              {result.alias.join(', ')}
            </Typography>
          ) : null}
        </Link>
      </Grid>
    ))
  }

  render() {
    const { classes } = this.props
    const { query } = this.state
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <CssBaseline />
          <Typography
            component="h3"
            variant="h3"
            className={classes.header}>
            Knowledge Graph Text Search
          </Typography>
          <form className={classes.form} noValidate onSubmit={this.submit.bind(this)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper component="div" className={classes.paper} square>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Input
                        text={query}
                        autoFocus={true}
                        onChange={this.handleOnChange.bind(this)} />
                    </Grid>
                  </Grid>
                </Paper>
                {this.renderResults()}
              </Grid>
            </Grid>
          </form>
        </Container>
      </ThemeProvider>
    )
  }
}


export default withStyles(styles)(App)
