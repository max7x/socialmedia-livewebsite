import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import { apiSignOut } from "../../apis/api";

const Container = styled.div`
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  left: 0;
  padding: 0 24px;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1128px;
`;

const Logo = styled.span`
  margin-right: 8px;
  font-size: 0px;
`;

const Nav = styled.nav`
  margin-left: auto;
  display: block;
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
  }
`;

const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;
`;

const NavList = styled.li`
  display: flex;
  align-items: center;
  cursor: default;
  a {
    align-items: center;
    background: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 42px;
    min-width: 80px;
    position: relative;
    text-decoration: none;
  }

  span {
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    min-width: 70px;
  }

  &:hover,
  &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;

const SignOut = styled(NavList)`
  text-align: center;
  width: 100px;
  height: 40px;
  span {
    font-size: 14px;
  }
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
`;

const User = styled(NavList)`
  a > svg {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  a > img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-bottom: 0px;
    object-fit: cover;
    vertical-align: middle;
  }

  span {
    display: flex;
    align-items: center;
  }
`;

const Header = (props) => {
  return (
    <Container>
      <Content>
        <Logo>
          <Link to="/home">
            <img src="/images/home-logo.svg" alt="logo" />
          </Link>
        </Logo>
        <Nav>
          <NavListWrap>
            <NavList>
              <Link to="/home">
                <img src="/images/nav-home.svg" alt="nav" />
                <span>Home</span>
              </Link>
            </NavList>
            <User>
              <Link to="/profile">
                <img src={props.user.photoURL} alt="user" />
                <span>Profile</span>
              </Link>
            </User>
            <SignOut onClick={() => props.signOut()}>
              <Link to="/">
                <span>Sign Out</span>
              </Link>
            </SignOut>
          </NavListWrap>
        </Nav>
      </Content>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signOut: () => apiSignOut(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
