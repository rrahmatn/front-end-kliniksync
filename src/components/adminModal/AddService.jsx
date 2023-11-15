import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

export const AddService = () => {
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
        document.getElementById("addService").close();
      }, 2000);
    }
  }, [toast]);

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      price: 0,
    },
    onSubmit: async (values, e) => {
      try {
        const access_Token = localStorage.getItem("accessToken");
        const at = access_Token;

        // Use the current role directly from formik.values.role
        const response = await axios.post(
          `http://127.0.0.1:3333/admin/masterservice`,
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
      <dialog id="addService" className="modal">
        <div className="lg:w-1/3 w-1/2 bg-white p-4 h-fit rounded-lg pt-1 flex flex-col items-center">
          <div className="w-full mt-6 flex items-center ">
            <h2 className=" text-xl tracking-wider m-auto ">Tambah Layanan </h2>
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
                <li className="w-full flex flex-col pr-4">
                  <label htmlFor="type" name="type">
                    Type :
                  </label>
                  <select
                    id="type"
                    name="type"
                    onChange={formik.handleChange}
                    value={formik.values.type}
                    className="w-full h-8 ring-1 mt-2 px-3 pr-5 rounded-md shadow-md"
                    required
                  >
                    <option value="receptionist">Pilih Type</option>
                    <option value="service">Layanan</option>
                    <option value="medicine">Obat</option>
                  </select>
                </li>
                <li className="w-full flex flex-col pr-4 ">
                  <label htmlFor="price" name="price">
                    Harga :
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    onChange={formik.handleChange}
                    value={formik.values.price}
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md no-spin"
                    required
                    onInput={(e) => {
                      // Prevent input of 0
                      if (e.currentTarget.value < 0) {
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </li>
              </div>
              <div className="modal-action  flex flex-row justify-end items-center p-1 pr-2">
                <button
                  type="submit"
                  className="btn btn-sm shadow-lg font-medium bg"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  className="btn btn-error font-medium shadow-lg  btn-sm "
                  onClick={() => document.getElementById("addService").close()}
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
              <span>Berhasil menambahkan service</span>
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
