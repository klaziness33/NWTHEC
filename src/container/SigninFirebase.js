/**
 * Signin Firebase
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input } from "reactstrap";
import LinearProgress from "@material-ui/core/LinearProgress";
import QueueAnim from "rc-queue-anim";
import { Fab } from "@material-ui/core";

// components
import { SessionSlider } from "Components/Widgets";

// app config
import AppConfig from "Constants/AppConfig";

// redux action
import { signinUserInBC, fetchingDataBranch } from "Actions";

//Auth File
import Auth from "../Auth/Auth";

const auth = new Auth();

class Signin extends Component {
  state = {
    email: "nch@naviworld-asia.com",
    password: "P@ssw0rd"
  };

  componentDidMount() {
    if (this.props.user !== null)
      this.props.history.push("/app/expense/expense-management");
    else localStorage.clear();
  }

  /**
   * On User Login
   */
  onUserLogin() {
    if (this.state.email !== "" && this.state.password !== "") {
      this.props.signinUserInBC(this.state, this.props.history);
    }
  }

  /**
   * On User Sign Up
   */
  onUserSignUp() {
    this.props.history.push("/signup");
  }

  //Auth0 Login
  loginAuth0() {
    auth.login();
  }

  render() {
    const { email, password } = this.state;
    const { loading } = this.props;
    return (
      <QueueAnim type="bottom" duration={2000}>
        <div className="rct-session-wrapper">
          {loading && <LinearProgress />}
          <AppBar position="static" className="session-header">
            <Toolbar>
              <div className="container">
                <div className="d-flex justify-content-between">
                  <div className="session-logo">
                    <Link to="/">
                      <img
                        src={AppConfig.appLogo}
                        alt="session-logo"
                        className="img-fluid"
                        width="110"
                        height="35"
                      />
                    </Link>
                  </div>
                  <div>
                    {/* <a className="mr-15" onClick={() => this.onUserSignUp()}>
                      Create New account?
                    </a>
                    <Button
                      variant="contained"
                      className="btn-light"
                      onClick={() => this.onUserSignUp()}
                    >
                      Sign Up
                    </Button> */}
                  </div>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <div className="session-inner-wrapper">
            <div className="container">
              <div className="row row-eq-height">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="session-body text-center">
                    <div className="session-head mb-30">
                      <h2 className="font-weight-bold">
                        Wellcome to {AppConfig.brandName}
                      </h2>
                      <p className="mb-0">Shell Thailand Gas Station</p>
                    </div>
                    <Form>
                      <FormGroup className="has-wrapper">
                        <Input
                          type="mail"
                          value={email}
                          name="user-mail"
                          id="user-mail"
                          className="has-input input-lg"
                          placeholder="Enter Email Address"
                          onChange={event =>
                            this.setState({ email: event.target.value })
                          }
                        />
                        <span className="has-icon">
                          <i className="ti-email"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          value={password}
                          type="Password"
                          name="user-pwd"
                          id="pwd"
                          className="has-input input-lg"
                          placeholder="Password"
                          onChange={event =>
                            this.setState({ password: event.target.value })
                          }
                        />
                        <span className="has-icon">
                          <i className="ti-lock"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="mb-15">
                        <Button
                          color="primary"
                          className="btn-block text-white w-100"
                          variant="contained"
                          size="large"
                          onClick={() => this.onUserLogin()}
                        >
                          Sign In
                        </Button>
                      </FormGroup>
                    </Form>
                    <p className="mb-0">
                      <a
                        target="_blank"
                        href="#"
                        className="text-muted"
                      >
                        Develop by NaviWorld (Thailand) Co. Ltd
                      </a>
                    </p>
                  </div>
                </div>
                {/* <div className="col-sm-5 col-md-5 col-lg-4">
                           <SessionSlider />
                        </div> */}
              </div>
            </div>
          </div>
        </div>
      </QueueAnim>
    );
  }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(mapStateToProps, {
  signinUserInBC
  // fetchingDataBranch
})(Signin);
