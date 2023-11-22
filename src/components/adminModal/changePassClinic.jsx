import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export const ChangePasswordClinic = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
        document.getElementById("changePasswordClinic").close();
      }, 2000);
    }
  }, [toast]);

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 3500);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confPassword: "",
    },
    onSubmit: async (values, e) => {
      try {
        const access_Token = localStorage.getItem("accessToken");
        const at = access_Token;

        // Use the current role directly from formik.values.role
        const response = await axios.patch(
          `http://127.0.0.1:3333/admin/changepassword`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${at}`,
            },
          }
        );

        setError("");
        setToast(true);

        formik.resetForm();
        setSubmitting(false);

        return response.data;
      } catch (err) {
        if (err.response.data.status === 404) {
          setError("pilih salah satu type");
        }
        setError(err.response.data.message);
        setSubmitting(false);

        return;
      }
    },
  });
  return (
    <>
      <dialog id="changePasswordClinic" className="modal">
        <div className="lg:w-1/3 w-1/2 bg-white p-4 h-fit rounded-lg pt-1 flex flex-col items-center">
          <div className="w-full mt-6 flex items-center ">
            <h2 className=" text-xl tracking-wider m-auto ">Ganti Password </h2>
          </div>
          <div className="w-5/6 h-2/3 flex flex-col justify-between pt-5">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-3 list-none"
            >
              <li>
                <label htmlFor="oldPassword" name="oldPassword">
                  Password Lama
                </label>
                <span className="w-96 h-9 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                  <input
                    onChange={formik.handleChange}
                    type={!showPassword ? "password" : "text"}
                    id="oldPassword"
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
                    className="w-80 h-full  focus:outline-none"
                    onChange={formik.handleChange}
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
                    className="w-80 h-full focus:outline-none"
                    onChange={formik.handleChange}
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
                <button className="btn bg w-1/2 shadow-sm" type="submit">
                  Ubah
                </button>
                <button
                  type="button"
                  className="btn btn-warning shadow-sm w-1/2"
                  onClick={() => {
                    formik.resetForm();
                    document.getElementById("changePasswordClinic").close();
                  }}
                >
                  Batal
                </button>
              </span>
            </form>
          </div>
        </div>
        {toast ? (
          <div className="toast toast-top z-[1000] toast-center">
            <div className="alert alert-success">
              <span>Berhasil mengganti password clinic</span>
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
      </dialog>
    </>
  );
};
