import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const AddEmployeModal = () => {
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [cookies] = useCookies(["name"]);
  const [role, setRole] = useState("");

  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(false), 5000);
      document.getElementById("addEmploye").close()
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
      role: "",
      password: "",
      confPassword: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
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

        const dataToSend = {
          ...values,
        };

        // Use the current role directly from formik.values.role
        const response = await axios.post(
          `http://127.0.0.1:3333/admin/${values.role}`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${at}`,
            },
          }
        )

        setRole(values.role); // Set the role after the form is successfully submitted
        setError("");
        setToast(true);

        // Reset the form and setSubmitting to false
        formik.resetForm();
        setSubmitting(false);
        
        return response.data;
      } catch (err) {
        if(err.response.data.status === 404){
            setError('pilih salah satu role untuk karyawan baru anda')
        }
        setError(err.response.data.message);
        setSubmitting(false);
      }
    },
  });
  return (
    <>
      <dialog id="addEmploye" className="modal">
        <div className="lg:w-1/3 w-1/2 bg-white p-4 h-fit rounded-lg pt-1 flex flex-col items-center">
          <div className="w-full mt-6 flex items-center ">
            <h2 className=" text-xl tracking-wider m-auto ">Tambah Karyawan </h2>
          </div>
          <div className="w-5/6 h-2/3 flex flex-col justify-between pt-5">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-3  h-full list-none"
            >
              <div className="w-full flex flex-col gap-1 items-end">
                <li className="w-full flex flex-col  pr-4 ">
                  <label htmlFor="name" name="name">
                    Nama :
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
                <li className="w-full flex flex-col pr-4 ">
                  <label htmlFor="email" name="email">
                    Email :
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
                <li className="w-full flex flex-col pr-4">
                  <label htmlFor="role" name="role">
                    Role :
                  </label>
                  <select
                    id="role"
                    name="role"
                    onChange={formik.handleChange}
                    value={formik.values.role}
                    className="w-full h-8 ring-1 mt-2 px-3 pr-5 rounded-md shadow-md"
                    required
                  >
                    <option value="default">Pilih Role</option>
                    <option value="receptionist">Resepsionis</option>
                    <option value="doctor">Dokter</option>
                    <option value="pharmacy">Farmasi</option>
                    <option value="cashier">Kasir</option>
                  </select>
                </li>
                <p className="text-sm mx-auto my-1 italic">Untuk dokter jangan lupa untuk edit spesialis dan harga</p>
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
              <div className="modal-action  flex flex-row justify-end items-center p-1 pr-2">
                <button
                  type="submit"
                  className="btn btn-sm shadow-lg font-medium bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED]"
                >
                  Tambah Karyawan
                </button>
                <button
                  type="button"
                  className="btn bg-[#FFFFFF] text-[#E64D4D] border-[#E64D4D] hover:bg-[#E64D4D] hover:text-[#FFFFFF] font-medium shadow-lg  btn-sm "
                  onClick={() => document.getElementById("addEmploye").close()}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
        {toast ? (
          <div className="toast toast-top z-[1000] toast-center">
            <div className="alert alert-success">
              <span>Berhasil menambahkan karyawan</span>
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

export default AddEmployeModal;
