import React, { useEffect } from "react";
import styled from "styled-components";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import Main from "./Main";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import Header from "./Header";
import { LOGGED_IN } from "../../reducers";
import { apiGetHomeData } from "../../apis/api";

const Container = styled.div`
  padding-top: 52px;
  max-width: 100%;
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "LeftSide Main RightSide";
  grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
  column-gap: 25px;
  row-gap: 25px;
  grid-template-rows: auto;
  margin: 25px 0;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`;

const Home = (props) => {
  useEffect(() => {
    props.getInfo();
  }, []);
  return (
    <>
      <Header />
      {props.user.status !== LOGGED_IN ? <Navigate to="/" /> : <></>}
      <Container>
        <Layout>
          <LeftSide />
          <Main />
          <RightSide />
        </Layout>
      </Container>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getInfo: () => apiGetHomeData(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
