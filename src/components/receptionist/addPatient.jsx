import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

const AddPatient = () => {
  const [error, setError] = useState("");
  const [toast2, setToast2] = useState(false);
  useEffect(() => {
    if (toast2) {
      setTimeout(() => {
        setToast2(false);
        document.getElementById("addPatient").close();
      }, 1500);
    }
  }, [toast2]);

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: {
      nik: "",
      name: "",
      phone: "",
      gender: "",
      birth_date: "",
      address: "",
    },

    onSubmit: async (values) => {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;

      const formattedDate = new Date(values.birth_date)
        .toISOString()
        .split("T")[0];

      const body = {
        nik : values.nik,
        name: values.name,
        phone: values.phone,
        birth_date: formattedDate,
        gender: values.gender,
        address: values.address,
      };

      try {
        const response = await axios.post(
          `http://127.0.0.1:3333/receptionist/patient`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${at}`,
            },
          }
        );

        setToast2(true);

        formik.setValues({
          nik: "",
          name: "",
          phone: "",
          birth_date: "",
          gender: "",
          address: "",
        });
        console.log(response);

        return response;
      } catch (err) {
        setToast2(false);
        setError(err.response.data.message);
        console.log(err);
        console.log(err.response.data.message);
      }
    },
  });

  return (
    <>
      <dialog id="addPatient" className="modal">
        <div className="w-2/3 bg-base-100 h-fit px-3 py-5 pt-9 rounded-md shadow-xl">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-2  h-full list-none"
          >
            <div className="w-full h-fit flex flex-row px-4">
              <div className="w-1/2 flex flex-col gap-3 items-end">
                <li className="w-full flex flex-col  pr-4 ">
                  <label htmlFor="nik" name="nik">
                    NIK :
                  </label>
                  <input
                    type="text"
                    id="nik"
                    name="nik"
                    onChange={formik.handleChange}
                    value={formik.values.nik}
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
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
                  <label htmlFor="birth_date" name="birth_date">
                    Tanggal Lahir :
                  </label>
                  <input
                    type="date"
                    onChange={formik.handleChange}
                    value={formik.values.birth_date}
                    id="birth_date"
                    name="birth_date"
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
                <li className="w-full flex flex-col pr-4 ">
                  <label htmlFor="phone" name="phone">
                    No. Telp :
                  </label>
                  <input
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    id="phone"
                    name="phone"
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
              </div>
              <div className="w-1/2 flex flex-col gap-3">
                <li className="w-full flex flex-col pr-4">
                  <label htmlFor="gender" name="gender">
                    Jenis Kelamin
                  </label>
                  <select
                    id="gender"
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                    name="gender"
                    className="w-full h-8 ring-1 mt-2 px-3 pr-5 rounded-md shadow-md"
                    required
                  >
                    <option value="...">Jenis Kelamin</option>
                    <option value="laki-laki">Laki-Laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </li>
                <li className="w-full flex flex-col pr-4 mt-5">
                  <label htmlFor="address" name="address">
                    Alamat :
                  </label>
                  <textarea
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    id="address"
                    name="address"
                    className="w-full h-40 p-2 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
              </div>
            </div>
           <div className="w-full flex flex-row justify-end px-5 pt-2">
           <button
              type="submit"
              className="btn btn-sm shadow-lg font-medium bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED]"
            >
              Tambah Pasien
            </button>
            <button
              type="button"
              className="btn bg-[#FFFFFF] text-[#E64D4D] border-[#E64D4D] hover:bg-[#E64D4D] hover:text-[#FFFFFF] font-medium shadow-lg  btn-sm "
              onClick={() => {
                document.getElementById("addPatient").close();
                formik.setValues({
                  name: "",
                  phone: "",
                  birth_date: "",
                  gender: "",
                  address: "",
                });
              }}
            >
              batal
            </button>
           </div>
          </form>
        </div>
      </dialog>
      {toast2 ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Berhasil Menambah Data Pasien</span>
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

export default AddPatient;
