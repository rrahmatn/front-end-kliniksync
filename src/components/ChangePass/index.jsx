import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ChangePass = ({ id , url}) => {
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confPassword: "",
    },

    onSubmit: async (values) => {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;
      try {
        if (values.newPassword.length < 8) {
          setError("Password harus memiliki setidaknya 8 karakter");
          return false
        }

        if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(values.newPassword)) {
          setError(
            "Password harus mengandung kombinasi antara huruf dan angka"
          );
          return false
        }

        if (values.confPassword !== values.newPassword) {
          setError("Konfirmasi password tidak cocok");
          return false
        }
        const response = await axios.patch(
          `http://127.0.0.1:3333/${url}/${id}`,
          values,
          {
            headers: {
              "Content-Type": "application/json", // Adjust the content type based on your API requirements
              Authorization: `Bearer ${at}`,
            },
          }
        );
        setTimeout(() => {
          document.getElementById("change_password").close();
        }, 3000);
        console.log(response);
        setToast(true);
        return response.data;
      } catch (err) {
        setError(err.response.data.message)
      }
    },
  });

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
      }, 3000);
    }
  }, [toast]);
  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  return (
    <>
      <dialog
        id="change_password"
        className="modal modal-bottom sm:modal-middle  p-4"
      >
        <div className="modal-box">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col list-none mx-auto"
          >
            <li>
              <label htmlFor="newPassword" name="newPassword">
                Password Baru
              </label>
              <span className="w-full h-9 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                <input
                  type={!showPassword2 ? "password" : "text"}
                  id="newPassword"
                  className="w-80 h-full  focus:outline-none"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
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
              <span className="w-full h-9 ring-1 px-3 shadow-sm  flex flex-row  justify-between rounded-md">
                <input
                  type={!showPassword3 ? "password" : "text"}
                  id="confPassword"
                  className="w-80 h-full focus:outline-none"
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
            <div className="modal-action ">
              <button
                type="submit"
                className="btn btn-error btn-sm font-medium"
                onClick={() => {
                  setTimeout(() => {
                    formik.handleReset((e) => {
                      e.name;
                      e.password;
                    });
                  }, 300);
                }}
              >
                Ganti Password
              </button>

              <button
                type="button"
                className="btn btn-warning btn-sm font-medium"
                onClick={() =>
                  document.getElementById("change_password").close()
                }
              >
                Batal
              </button>
            </div>
          </form>
        </div>
        {toast ? (
          <div className="toast z-[9999999] fixed toast-top toast-center">
            <div className="alert alert-success">
              <span>Berhasil mengubah password</span>
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

export default ChangePass;
