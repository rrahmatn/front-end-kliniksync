import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Hero from "./../../assets/hero.svg";
import { useFormik } from "formik";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getUser, useAccessToken } from "../../state";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Auth = () => {
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies([
    "refresh_token",
    "role",
    "name",
    "email",
  ]);
  const [, setAccessToken] = useAccessToken();
  const [, setUser] = getUser();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cookie.refresh_token) {
      navigate(`/${cookie.role}`);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await axios
          .post("http://127.0.0.1:3333/auth/signin", values)
          .then((res) => {
            const refreshToken = res.data.refresh_token;
            setCookie("refresh_token", refreshToken, {
              // httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Setel ke `true` jika menggunakan HTTPS
              maxAge: 90 * 24 * 60 * 60, // Contoh: 30 hari
              sameSite: "strict",
              path: "/",
            });
            const decodedToken = jwtDecode(refreshToken);
            setCookie("name", decodedToken.name, {
              // httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Setel ke `true` jika menggunakan HTTPS
              maxAge: 90 * 24 * 60 * 60, // Contoh: 30 hari
              sameSite: "strict",
              path: "/",
            });
            setCookie("role", decodedToken.role, {
              // httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Setel ke `true` jika menggunakan HTTPS
              maxAge: 90 * 24 * 60 * 60, // Contoh: 30 hari
              sameSite: "strict",
              path: "/",
            });
            setCookie("email", decodedToken.email, {
              // httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Setel ke `true` jika menggunakan HTTPS
              maxAge: 90 * 24 * 60 * 60, // Contoh: 30 hari
              sameSite: "strict",
              path: "/",
            });

            // console.log(res.data.access_token)
            localStorage.setItem("accessToken", res.data.access_token);
            setAccessToken(res.data.access_token);
            return decodedToken;
          })
          .then((e) => {
            setUser({ id: e.sub, name: e.name, email: e.email, role: e.role });
            return e;
          })
          .then((user) => {
            if (user.role === "admin") {
              navigate("/admin");
            } else if (user.role === "receptionist") {
              navigate("/receptionist");
            } else if (user.role === "doctor") {
              navigate("/doctor");
            } else if (user.role === "pharmacy") {
              navigate("/pharmacy");
            } else if (user.role === "cashier") {
              navigate("/cashier");
            } else {
              navigate("/superadmin");
            }
          });
        setError("");
      } catch (error) {
        setError(error.response.data.message);
      }
    },
  });

  return (
    <>
      <div className="w-full overflow-x-auto h-fit flex flex-row text">
        <figure className="hidden md:w-3/5 h-full m-auto  md:flex items-center justify-center">
          <img src={Hero} alt="hero" className="h-full m-auto w-fit" />
        </figure>
        <section className="w-fit md:w-2/5 h-fit ">
          <div className="w-fit h-full items-center md:items-start flex flex-col pt-32 pb-10  justify-around ml-10">
            <div className="flex flex-col items-center px-3 gap-2 my-3">
              <h3 className=" text-xl w-full">Selamat Datang</h3>
              <p className="text-xs w-full">
                Silahkan login untuk akses data anda
              </p>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="w-fit gap-3  flex  flex-col  p-5 list-none pb-20"
            >
              {error ? (
                <p className="text-xs text-error mx-auto ">{error}</p>
              ) : (
                ""
              )}
              <li className="flex flex-col md:mx-2 gap-2">
                <label className="ml-2" htmlFor="email" name="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukan alamat email anda"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="w-80 h-10 ring-1 px-2 shadow-sm rounded-md focus:outline-none"
                />
              </li>
              <li className="flex flex-col md:mx-2 mx-auto gap-2">
                <label className="ml-2" htmlFor="password" name="password">
                  Password
                </label>
                <span className="w-80 h-10 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                  <input
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="Masukan password anda"
                    type={!showPassword ? "password" : "text"}
                    id="password"
                    className="w-56 h-full focus:outline-none"
                  />
                  <button
                    className="w-auto h-full flex items-center justify-center text-xl"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    onMouseLeave={() => setShowPassword(false)}
                  >
                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </span>

                <button type="submit" className="btn mr-0 bg w-28 mt-6">
                  Login
                </button>
              </li>
            </form>
          </div>
        </section>
      </div>
      <Navbar />
    </>
  );
};

export default Auth;
