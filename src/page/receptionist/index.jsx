// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import Navbar from "../../components/navbar";
import UserModal from "../../components/userModal.";
import { useLocation, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { useAccessToken } from "../../state";
const Receptionist = () => {
  const navigate = useNavigate();
  const iniLocation = useLocation();
  const location = iniLocation.pathname;
  const [cookie] = useCookies(["role"]);
  const [token] = useAccessToken()

  useEffect(() => {
    if (location !== '/auth' && !cookie.role) {
      navigate("/auth");
      return false
    }
    if (cookie.role !== "receptionist") {
      navigate(`/${cookie.role}`);
    }
  }, []);

  return (
    <>
      <div className="w-full h-fit flex flex-col py-20">{token} </div>
      <Navbar />
      <UserModal />
    </>
  );
};

export default Receptionist;
