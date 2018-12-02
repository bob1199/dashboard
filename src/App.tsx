import * as React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateAccount from './containers/createAccount';
import resetPassword from './containers/resetPassword';
import HomeComponent from './components/HomeComponent';
import LoginContainer from 'src/containers/login';
import withAuthRedirect from 'src/hoc/withAuthRedirect';
import ForgotPasswordContainer from 'src/containers/forgotPassword';
import { ThemeProvider } from 'styled-components';
import theme from 'src/theme';
import FrontendRoute from './config/FrontendRoute';
import PasswordResetContainer from './containers/passwordResetEmailConfirmation';


class App extends React.Component {

  public render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact={true} path="/" component={withAuthRedirect(HomeComponent)} />
            <Route path={FrontendRoute.CREATE_ACCOUNT_PAGE} component={withAuthRedirect(CreateAccount, false)} />
            <Route path={FrontendRoute.RESET_PASSWORD_PAGE} component={withAuthRedirect(resetPassword, false)} />
            <Route path={FrontendRoute.FORGOT_PASSWORD_PAGE} component={withAuthRedirect(ForgotPasswordContainer, false)} />
            <Route path={FrontendRoute.RESET_PASSWORD_EMAIL_SENT_PAGE} component={withAuthRedirect(PasswordResetContainer, false)} />
            <Route path={FrontendRoute.LOGIN_PAGE} component={withAuthRedirect(LoginContainer, false)} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    );

  }
}

export default App;
