import { GetServerSideProps, NextPage } from "next";
import LayoutManager from "../../components/LayoutManager";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";

const conges: NextPage = (props:any) => {

    return <LayoutManager></LayoutManager>;


};

export default conges;
