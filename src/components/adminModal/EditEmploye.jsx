import React, { useEffect, useState } from "react";
import axios from "axios";

export const EditEmployeModal = ({ id, role }) => {
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [editedValues, setEditedValues] = useState({
    name: "",
    email: "",
    role: "",
    specialist: "",
    price: 0,
  });
  const [values, setValues] = useState({
    name: "",
    specialist: "",
  });
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
        document.getElementById("editEmploye").close();
      }, 1500);
    }
  }, [toast]);
  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  }, [error]);

  const getClinic = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios.get(
        `http://127.0.0.1:3333/admin/${role}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );
      const clinicData = response.data.data;

      if (role === "doctor") {
        setEditedValues({
          name: clinicData.name,
          email: clinicData.email,
          price: clinicData.price,
          specialist: clinicData.specialist,
        });
        setValues({
          name: clinicData.name,
          specialist: clinicData.specialist,
        });
        return;
      } else {
        setEditedValues({
          name: clinicData.name,
          email: clinicData.email,
        });
        setValues({
            name: clinicData.name,
          });
      }
      setError("");
      return;
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (id > 0) {
      getClinic();
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "price" ? parseFloat(value) : value;

    setEditedValues((prevValues) => ({
      ...prevValues,

      [name]: numericValue,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;

    try {
      const response = await axios.patch(
        `http://127.0.0.1:3333/admin/edit/${role}/${id}`,
        editedValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );
      setToast(true);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <dialog id="editEmploye" className="modal">
        <div className="modal-box w-1/2 h-fit pb-0 max-w-5xl flex gap-0 flex-col">
          <span className="w-full h-9 pl-4  capitalize text-xl flex flex-row justify-between">
            {values.name}
          </span>
          <span className="w-full h-9  gap-1 tracking-wide  pl-4 border-b-2 capitalize shadow-sm rounded-md text-md  flex flex-row justify-start">
            {role} <p> </p>
            {values.specialist}
          </span>
          <div className="w-full h-full flex flex-col justify-between pt-3">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3  h-full list-none"
            >
              <div className="w-full flex flex-col gap-3 items-end">
                <li className="w-full flex flex-col  pr-4 ">
                  <label htmlFor="ininamaklinik" name="name">
                    Nama :
                  </label>
                  <input
                    type="text"
                    id="ininamaklinik"
                    name="name"
                    onChange={handleInputChange}
                    value={editedValues.name}
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
                    onChange={handleInputChange}
                    value={editedValues.email}
                    className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                    required
                  />
                </li>
                {role === "doctor" ? (
                  <ul className="w-full flex flex-row items-center justify-between">
                    <li className="w-1/2 flex flex-col pr-4 ">
                      <label htmlFor="specialist" name="specialist">
                        Specialist :
                      </label>
                      <input
                        type="text"
                        id="specialist"
                        name="specialist"
                        onChange={handleInputChange}
                        value={editedValues.specialist}
                        className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                        required
                      />
                    </li>
                    <li className="w-2/5 flex flex-col pr-4 ">
                      <label htmlFor="price" name="price">
                        Biaya/transaksi :
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        onChange={handleInputChange}
                        value={editedValues.price}
                        className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                        required
                      />
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </div>
              <div className="modal-action   flex flex-row justify-end items-center p-3 pr-2">
                <button
                  type="submit"
                  className="btn btn-sm shadow-lg font-medium bg"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-error font-medium shadow-lg  btn-sm "
                  onClick={() => document.getElementById("editEmploye").close()}
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
              <span>Berhasil mengubah {editedValues.name}</span>
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
