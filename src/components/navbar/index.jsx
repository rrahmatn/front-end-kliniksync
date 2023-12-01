// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Logo from "./../../assets/Logo.svg";
import { BiUserCircle } from "react-icons/bi";
import { getLogin, getUser, useAccessToken } from "../../state";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Logout from "../logout";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = getUser();
  const [isLogin, setIslogin] = getLogin();
  const [accessToken, setAccessToken] = useAccessToken();
  const [cookies, setCookies, removeCookies] = useCookies([
    "refresh_token",
    "role",
    "name",
  ]);

  const [iniUser, setIniUser] = useState({
    name: "k.l.e",
  });

  useEffect(() => {
    const fecth = async () => {
      if (location !== "/auth" && !cookies.role) {
        navigate("/auth");
      }
      if (cookies.refresh_token) {
        await getRt();
      }
    };
    fecth();
  }, []);
  const rt = cookies.refresh_token;
  let timer;

  useEffect(() => {
    if (cookies.refresh_token) {
      const iniRt = cookies.refresh_token;
      getRt()
      setIslogin(true);
      setIniUser(jwtDecode(iniRt));
    } else {
      navigate(`/auth`);
    }
    if (rt) {
      timer = setInterval(async () => {
        await getRt();
      }, 1000 * 60 * 5);
    }
  }, []);

  const getRt = async () => {
    await axios
      .get(
        `http://127.0.0.1:3333/auth/refresh-token`,

        {
          headers: {
            "Content-Type": "application/json", // Adjust the content type based on your API requirements
            Authorization: `Bearer ${cookies.refresh_token}`,
          },
        }
      )
      .then((res) => {
        clearInterval(timer);
        localStorage.setItem("accessToken", res.data.access_token);
        setAccessToken(res.data.access_token);
      });
  };

  // console.log(cookies);

  return (
    <>
      <div className="navbar w-full fixed top-0 bg-base-100 items-center shadow-md h-[64px] pl-12 pr-4 flex flex-row justify-between text">
        {cookies.role !== "superadmin" && cookies.role !== "admin" ? (
          <figure className="w-fit h-full py-1">
            <img src={Logo} alt="logo" className="h-full w-fit" />
          </figure>
        ) : (
          ""
        )}
        {isLogin && iniUser.name !== "k.l.e" ? (
          <span
            className={`flex-none mr-0 gap-2 ${
              cookies.role !== "superadmin" && cookies.role !== "admin"
                ? ""
                : "ml-auto"
            }`}
          >
            <div className="dropdown pr-0 dropdown-end">
              <span
                tabIndex={0}
                className="w-fit min-w-[200px] h-fit cursor-pointer flex flex-row gap-2 justify-end items-center "
              >
                <h2 className="capitalize">
                  {cookies.name ? cookies.name : "user"}
                </h2>
                <BiUserCircle className="text-3xl font-bold" />
              </span>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-md dropdown-content bg-base-100 rounded-md w-52"
              >
                {cookies.role !== "admin" ? (
                  <li>
                    <button
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      Profile
                    </button>
                  </li>
                ) : (
                  ""
                )}
                <li>
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_2").showModal();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </span>
        ) : (
          ""
        )}
      </div>
      <Logout />
    </>
  );
};

export default Navbar;
