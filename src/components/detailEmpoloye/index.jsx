import axios from "axios";
import React, { useEffect, useState } from "react";
import ChangePass from "../ChangePass";
import { IoMdRefreshCircle } from "react-icons/io";
import DeleteClinic from "../deleteClinic";
import { EditEmployeModal } from "../adminModal";

const DetailEmploye = ({ id, role }) => {
  const [clinic, setClinic] = useState([]);


  const getEmploye = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get(
          `http://127.0.0.1:3333/admin/${role}/${id}`,

          {
            headers: {
              "Content-Type": "application/json", // Adjust the content type based on your API requirements
              Authorization: `Bearer ${at}`,
            },
          }
        )
        .then((response) => {
          setClinic(response.data.data)
        });

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const refresh = async () => {
    await getEmploye();

    return false;
  };

  useEffect(() => {
    if (id > 0) {
      getEmploye();
    }
  }, [id]);

  return (
    <>
      <input type="checkbox" id="getEmploye" className="modal-toggle" />
      <div className="modal  ">
        <div className="modal-box h-1/2 flex flex-col items-center ">
          <label
            htmlFor="getEmploye"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
          <span className="text-lg font-bold mb-4 tracking-wider flex flex-row gap-2">
            Informasi Karyawan
            <button
              onClick={refresh}
              className="mx-3 flex h-full w-fit p-1 items-center"
            >
              <IoMdRefreshCircle className="text-2xl" />
            </button>
          </span>
          <div className="w-full flex items-center mb-2 pl-4 justify-evenly">
            <table className="w-11/12">
              <thead>
                <tr className="h-10 hidden">
                  <th className="w-1/3 px-1 ">Nama Klinik</th>
                  <th className="w-1/12 ">:</th>
                  <th className="w-1/2 capitalize">Kimia Farma</th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-9">
                  <td className="w-1/3 px-1 ">Nama </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{clinic.name}</td>
                </tr>
                <tr className="h-9">
                  <td className="w-1/3 px-1 "> Email</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 lowercase">{clinic.email}</td>
                </tr>
                <tr className="h-9">
                  <td className="w-1/3 px-1 "> Spesialis </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2">{clinic.specialist ? clinic.specialist : "-"}</td>
                </tr>
                <tr className="h-9">
                  <td className="w-1/3 px-1 "> Biaya/transaksi</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{clinic.price ? clinic.price : "-" }</td>
                </tr>
                <tr className="h-9">
                  <td className="w-1/3 px-1 "> Status</td>
                  <td className="w-1/12 ">:</td>

                  {role === "doctor" ? ( <td className="w-1/2">{`${
                    clinic.is_active ? "sedang aktif" : "sedang tidak aktif"
                  }`}</td>) : ""}
                 
                </tr>
              </tbody>
            </table>
          </div>
          <span className="w-full mt-auto flex flex-row justify-end gap-1  ">
            <button
              type="button"
              className="btn text-sm font-medium  btn-sm  btn-error cursor-pointer shadow-lg"
              onClick={() =>
                document.getElementById("delete_clinic").showModal()
              }
            >
              Hapus
            </button>
            <button
              type="button"
              className="btn text-sm font-medium  btn-sm btn-warning cursor-pointer shadow-lg"
              onClick={() =>
                document.getElementById("change_password").showModal()
              }
            >
              Ganti Password
            </button>
            <button
              type="button"
              className="btn text-sm font-medium  btn-sm  bg cursor-pointer shadow-lg"
                onClick={() => document.getElementById("editEmploye").showModal()}
            >
              Edit
            </button>
          </span>
        </div>
        <label className="modal-backdrop" htmlFor="getEmploye">
          Close
        </label>
      </div>
      <ChangePass url={`admin/changepassword/${role}`} id={id} />
      <DeleteClinic
        url={`admin/delete/${role}`}
        id={id}
        name={clinic.name}
      />
      <EditEmployeModal id={id} role={role}/>
    </>
  );
};

export default DetailEmploye;
