import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const AddSuperAdmin = () => {
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [cookies] = useCookies(["name"]);

  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 5000);
    }
  }, [toast]);
  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confPassword: "",
    },
    onSubmit: async (values) => {
      try {
        if (values.password.length < 8) {
          setError("Password harus memiliki setidaknya 8 karakter");
          return false;
        }

        if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(values.password)) {
          setError(
            "Password harus mengandung kombinasi antara huruf dan angka"
          );
          return false;
        }

        if (values.confPassword !== values.password) {
          setError("Konfirmasi password tidak cocok");
          return false;
        }
        const access_Token = localStorage.getItem("accessToken");
        const at = access_Token;

        // Format the expired_at date as "yyyy-mm-dd"

        const dataToSend = {
          ...values,
        };

        const response = await axios.post(
          `http://127.0.0.1:3333/superadmin`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${at}`,
            },
          }
        );
        console.log(response)
        setError("");
        setToast(true);
        return response
      } catch (err) {

        console.log(err)
        setError(err.response.data.message);
      }
    },
  });
  return (
    <>
      <div className="w-full h-fit p-2 pt-1 flex flex-col items-center">
        <div className="w-full px-16 mb-2 py-1">
          <h2 className="capitalize font-bold">
            Selamat Datang {cookies.name}
          </h2>
          <h2 className=" text-md ">Tambah Klinik </h2>
        </div>
        <div className="w-5/6 h-2/3 flex flex-col justify-between pt-5">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-3  h-full list-none"
          >
            <div className="w-full h-fit flex flex-col  px-4">
              <div className="w-2/3 flex flex-col  gap-3 items-end">
                <li className="w-full flex flex-col  pr-4 ">
                  <label htmlFor="ininamaklinik" name="name">
                    Nama:
                  </label>
                  <input
                    type="text"
                    id="ininamaklinik"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
                <li className="w-full flex flex-col pr-4 ">
                  <label htmlFor="iniemailclinic" name="email">
                    Email :
                  </label>
                  <input
                    type="text"
                    id="iniemailclinic"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>

                <li className="w-full flex  flex-col pr-4">
                  <label htmlFor="password" name="password">
                    Password :
                  </label>
                  <span className="w-full h-8 ring-1 px-3 mt-2 shadow-md flex flex-row  justify-between rounded-md">
                    <input
                      type={!showPassword2 ? "password" : "text"}
                      id="password"
                      name="password"
                      className="w-5/6 h-full  focus:outline-none"
                      onChange={formik.handleChange}
                      value={formik.values.password}
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
                <li className="w-full flex  flex-col pr-4">
                  <label htmlFor="confPassword" name="confPassword">
                    Konfirmasi Password Baru
                  </label>
                  <span className="w-full h-8 ring-1 px-3 mt-2 shadow-md flex flex-row  justify-between rounded-md">
                    <input
                      type={!showPassword3 ? "password" : "text"}
                      id="confPassword"
                      className="w-5/6 h-full focus:outline-none"
                      onChange={formik.handleChange}
                      value={formik.values.confPassword}
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
              </div>
              <div className=" gap-2 flex flex-row justify-start items-center pl-0 mt-2 p-3 pr-2">
                <button
                  type="submit"
                  className="btn btn-sm shadow-lg font-medium bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED]"
                >
                  Tambah Super Admin
                </button>
                <button
                  type="reset"
                  className="btn bg-[#FFFFFF] text-[#E64D4D] border-[#E64D4D] hover:bg-[#E64D4D] hover:text-[#FFFFFF] font-medium shadow-lg  btn-sm "
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {toast ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Berhasil menambahkan Super Admin</span>
          </div>
        </div>
      ) : (
        ""
      )}
      {error !== "" ? (
        <div className="toast z-[9999999] fixed toast-top toast-center">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default AddSuperAdmin;
