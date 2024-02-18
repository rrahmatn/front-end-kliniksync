// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useFormik } from "formik";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router";

const UserModal = () => {
  const iniLocation = useLocation();

  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [showPassword4, setShowPassword4] = useState(false);
  const [toast, setToast] = useState(false);
  const [toast2, setToast2] = useState(false);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [cookie, setCookie, removeCookies] = useCookies([
    "refresh_token",
    "role",
    "name",
    "email",
  ]);
  const nameFormCookies = cookie.name;

  const [name, setName] = useState(nameFormCookies);

  useEffect(()=>{
    if (error2) {
      setTimeout(() => setError2(false), 3000);
    }

  },[error2])

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 3000);
    }
  }, [toast]);
  useEffect(() => {
    if (toast2) {
      setTimeout(() => setToast2(false), 3000);
    }
  }, [toast2]);

  const formikPassword = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confPassword: "",
    },
    onSubmit: async (values) => {
      try {
        const access_Token = localStorage.getItem("accessToken");
        const at = access_Token;
          const response = await axios
            .patch(
              `http://127.0.0.1:3333/${cookie.role}/changepassword`,
              values,
              {
                headers: {
                  "Content-Type": "application/json", // Adjust the content type based on your API requirements
                  Authorization: `Bearer ${at}`,
                },
              }
            )
            .then((res) => res.data);
          document.getElementById("my_modal_1").close();

          setError2(false);
          setToast(true);
      } catch (err) {
        setError2(true);
        console.log(err);
      }
    },
  });
  const formik = useFormik({
    initialValues: {
      name: name,
      email: cookie.email,
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const access_Token = localStorage.getItem("accessToken");
        const at = access_Token;
        if (cookie.name !== values.name) {
          const response = await axios
            .patch(`http://127.0.0.1:3333/${cookie.role}`, values, {
              headers: {
                "Content-Type": "application/json", // Adjust the content type based on your API requirements
                Authorization: `Bearer ${at}`,
              },
            })
            .then((res) => res.data);
          const name = response.data.name;
          setName(name);
          setCookie("name", name, {
            // httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Setel ke `true` jika menggunakan HTTPS
            maxAge: 30 * 24 * 60 * 60, // Contoh: 30 hari
            sameSite: "strict",
            path: "/",
          });
          document.getElementById("my_modal_1").close();

          formik.setValues({
            name: response.data.name,
          });

          setError(false);
          setToast(true);
          return response.data;
        }
      } catch (err) {
        setError(true);
      }
    },
  });

  return (
    <>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box w-fit flex text flex-col">
          {changePassword ? (
            <form
              onSubmit={formikPassword.handleSubmit}
              className="flex flex-col gap-3 list-none"
            >
              {error2 ? (
                <p className="text-md text-error w-full text-center ">
                  Password Salah
                </p>
              ) : (
                ""
              )}
              <li>
                <label htmlFor="oldPassword" name="oldPassword">
                  Password Lama
                </label>
                <span className="w-96 h-9 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                  <input
                    type={!showPassword ? "password" : "text"}
                    id="oldPassword"
                    value={formikPassword.values.oldPassword}
                    onChange={formikPassword.handleChange}
                    className="w-80 h-full  focus:outline-none"
                    required
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
              </li>
              <li>
                <label htmlFor="newPassword" name="newPassword">
                  Password Baru
                </label>
                <span className="w-96 h-9 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                  <input
                    type={!showPassword2 ? "password" : "text"}
                    id="newPassword"
                    value={formikPassword.values.newPassword}
                    onChange={formikPassword.handleChange}
                    className="w-80 h-full  focus:outline-none"
                    required
                  />
                  <button
                    className="w-auto h-full flex items-center justify-center text-xl"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword2(!showPassword2);
                    }}
                    onMouseLeave={() => setShowPassword2(false)}
                  >
                    {showPassword2 ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </span>
              </li>
              <li>
                <label htmlFor="confPassword" name="confPassword">
                  Konfirmasi Password Baru
                </label>
                <span className="w-96 h-9 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                  <input
                    type={!showPassword3 ? "password" : "text"}
                    id="confPassword"
                    value={formikPassword.values.confPassword}
                    onChange={formikPassword.handleChange}
                    className="w-80 h-full focus:outline-none"
                    required
                  />
                  <button
                    className="w-auto h-full flex items-center justify-center text-xl"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword3(!showPassword3);
                    }}
                    onMouseLeave={() => setShowPassword3(false)}
                  >
                    {showPassword3 ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </span>
              </li>
              <span className="w-full px-4 flex flex-row gap-2 items-center justify-between">
                <button
                  className="btn btn-warning shadow-sm w-1/2"
                  type="button"
                  onClick={(e) => {
                    setChangePassword(!changePassword);
                    e.preventDefault();
                    setError(false);
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="btn bg w-1/2 shadow-sm"
                  type="submit"
                  onClick={() => {
                    if (!error) {
                      setTimeout(() => {
                        formikPassword.handleReset((e) => {
                          e.oldPassword;
                          e.newPassword;
                          e.confPassword;
                        });
                      }, 300);
                    }
                  }}
                >
                  Ubah
                </button>
              </span>
            </form>
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-3 list-none"
            >
              {error ? (
                <p className="text-md text-error w-full text-center ">
                  password salah
                </p>
              ) : (
                ""
              )}
              <li>
                <label htmlFor="name" name="name">
                  Name
                </label>
                <input
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  id="name"
                  name="name"
                  className="w-full h-9 ring-1 mt-2 px-3 rounded-md shadow-sm"
                  required
                />
              </li>
              <li>
                <label htmlFor="email" name="email">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="w-full h-9 disabled ring-1 mt-2 px-3 rounded-md shadow-sm"
                  disabled
                />
                <p className="text-[11px] italic my-1 ">
                  Hubungi admin klinik untuk mengganti email
                </p>
              </li>
              <li>
                <label htmlFor="password" name="password">
                  Password
                </label>
                <span className="w-96 h-9 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type={!showPassword4 ? "password" : "text"}
                    name="password"
                    id="password"
                    className={` w-80 h-full   focus:outline-none `}
                  />
                  <button
                    className="w-auto h-full flex items-center justify-center text-xl"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword4(!showPassword4);
                    }}
                    onMouseLeave={() => setShowPassword4(false)}
                  >
                    {showPassword4 ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </span>
                <p className="text-[11px] italic my-1">
                  Hubungi admin klinik jika anda lupa password
                </p>
              </li>
              <span className="w-full px-4 flex flex-row gap-2 items-center justify-between">
                <button
                  className="btn btn-warning shadow-sm w-1/2"
                  onClick={(e) => {
                    setChangePassword(!changePassword);
                    e.preventDefault();
                    setError(false);
                  }}
                >
                  Ganti Password
                </button>
                <button
                  onClick={() => {
                    if (!error) {
                      setTimeout(() => {
                        formik.handleReset((e) => {
                          e.name;
                          e.password;
                        });
                      }, 300);
                    }
                  }}
                  className={`btn w-1/2 shadow-sm bg`}
                  type="submit"
                >
                  Ubah
                </button>
              </span>
            </form>
          )}
          <form method="dialog">
            <button
              onClick={() => {
                formik.handleReset((e) => {
                  e.password;
                  e.name;
                });
                setChangePassword(false);
                setError(false);
                setError(false);
              }}
              className={`btn btn-sm btn-circle btn-ghost absolute right-2 top-2 `}
            >
              ✕
            </button>
          </form>
        </div>
      </dialog>
      {toast ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Berhasil mengubah data</span>
          </div>
        </div>
      ) : (
        ""
      )}
      {toast2 ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Berhasil mengubah password</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default UserModal;
