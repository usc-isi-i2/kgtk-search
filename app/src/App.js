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
  link: {
    marginTop: theme.spacing(3),
    display: 'inline-block',
    color: '#fefefe',
  },
  description: {
    color: '#fefefe',
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
      <Grid item xs={12} key={i}>
        <Link
          href={`https://sqid.toolforge.org/#/view?id=${result.qnode}`}
          variant="h5"
          target="_blank"
          className={classes.link}>
          {result.label[0]}
        </Link>
        <Typography
          component="p"
          variant="body1"
          className={classes.description}>
          {result.description[0]}
        </Typography>
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
            ISI's Wikidata Query Service
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
