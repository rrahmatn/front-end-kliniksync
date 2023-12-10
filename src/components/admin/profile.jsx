import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoStarSharp } from "react-icons/io5";
import { ChangePasswordClinic } from "../adminModal";

const ClinicProfile = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [detail , setDetail] =useState([])

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
  useEffect(() => {
    setToast(false);
    setError("");
  }, []);

  const getClinic = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get(`http://127.0.0.1:3333/admin`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((e) => {
          setData(e.data.data.clinic);
          setName(e.data.data.clinic.name);
          setDetail(e.data.data)
        });
      setError("");

      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClinic();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "price" ? parseFloat(value) : value;

    setData((prevValues) => ({
      ...prevValues,

      [name]: numericValue,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;

    try {
      const response = await axios.patch(`http://127.0.0.1:3333/admin`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${at}`,
        },
      });
      setToast(true);

      return response;
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-row ">
        <div className="w-1/2 h-full flex flex-col ">
          <nav className="w-full h-16 border-b-2 rounded-md shadow-md  justify-between flex flex-row items-center pl-4">
            <h2 className="text-xl tracking-wider capitalize">{name}</h2>
            {data.type === "premium" ? (
              <div className="w-40 h-full">
                <span
                  className={`h-1/2 w-40 ${
                    data.type === "premium" ? "bg-yellow-400" : "bg-blue-400"
                  }  rounded-bl-lg shadow-sm flex flex-row items-center justify-start text-lg gap-4 px-3 tracking-wider text-stone-700`}
                >
                  {" "}
                  <IoStarSharp className="text-stone-700 drop-shadow-md" />{" "}
                  Premium
                </span>
              </div>
            ) : (
              ""
            )}
          </nav>
          <div className="w-full h-full flex flex-col justify-between pt-5">
            <form
              className="flex flex-col gap-3  h-full list-none"
              onSubmit={handleSubmit}
            >
              <div className="w-full h-fit flex flex-row px-4">
                <div className="w-1/2 flex flex-col gap-3 items-end">
                  <li className="w-full flex flex-col  pr-4 ">
                    <label htmlFor="ininamaklinik" name="name">
                      Nama Klinik :
                    </label>
                    <input
                      type="text"
                      id="ininamaklinik"
                      name="name"
                      value={data.name}
                      onChange={handleInputChange}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="owner" name="owner">
                      Pemilik :
                    </label>
                    <input
                      type="text"
                      id="owner"
                      name="owner"
                      value={data.owner}
                      onChange={handleInputChange}
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
                      value={data.email}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      disabled
                    />
                  </li>
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="phone" name="phone">
                      No. Telp :
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={data.phone}
                      onChange={handleInputChange}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="address" name="address">
                      Alamat
                    </label>
                    <textarea
                      type="text"
                      id="address"
                      value={data.address}
                      name="address"
                      onChange={handleInputChange}
                      className="w-full h-28 p-2 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                </div>
              </div>
              <span className="text-sm italic w-full text-center">
                {" "}
                Untuk mengganti email silahkan hubungi admin aplikasi{" "}
              </span>
              <div className="modal-action   flex flex-row justify-end items-center pt-0 p-3 pr-7">
                <button
                  type="button"
                  className="btn bg-[#FFFFFF] text-[#8AD1F2] border-[#8AD1F2] hover:bg-[#E5F3FF] font-medium shadow-lg btn-sm "
                  onClick={() =>
                    document.getElementById("changePasswordClinic").showModal()
                  }
                >
                  Ganti Password
                </button>
                <button
                  type="submit"
                  className="btn bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED] font-medium shadow-lg btn-sm"
                >
                  Edit Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-1/2 h-full flex flex-col px-5">
          <nav className="w-full h-16 px-5 tracking-wider shadow-sm flex flex-row items-center text-lg">
            
            Detail 
          </nav>
          <div className="w-full h-full pt-5">
            <table className="w-11/12 ">
              <thead>
                <tr className="h-10 hidden">
                  <th className="w-1/3 px-1 ">Tagihan</th>
                  <th className="w-1/12 ">:</th>
                  <th className="w-1/2 capitalize">{detail.bill * 2000}</th>
                </tr>
              </thead>
              <tbody>

                <tr className="h-12">
                  <td className="w-1/3 px-1 ">Total Tagihan </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{detail.bill * 2000}</td>
                </tr>
                <tr className="h-12">
                  <td className="w-1/3 px-1 ">Total Karyawan </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{detail.receptionist + detail.doctors + detail.pharmacy + detail.cashier}</td>
                </tr>
                <tr className="h-12">
                  <td className="w-1/3 px-1 "> Resepsionis </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 lowercase">{detail.receptionist}</td>
                </tr>
                <tr className="h-12">
                  <td className="w-1/3 px-1 "> Dokter </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2">
                    {detail.doctors}
                  </td>
                </tr>
                <tr className="h-12">
                  <td className="w-1/3 px-1 "> Farmasi </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2">
                    {detail.pharmacy}
                  </td>
                </tr>
                <tr className="h-12">
                  <td className="w-1/3 px-1 "> Kasir </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2">
                    {detail.cashier}
                  </td>
                </tr>
               
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {toast ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Berhasil mengubah data klinik</span>
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
      <ChangePasswordClinic />
    </>
  );
};

export default ClinicProfile;
