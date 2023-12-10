import React, { useEffect, useState } from "react";
import { MdManageSearch } from "react-icons/md";
import { IoIosRefreshCircle } from "react-icons/io";
import axios from "axios";
import { AddService } from "../adminModal/AddService";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import DeleteClinic from "../deleteClinic";

export const AdminService = () => {
  const [paraMasterService, setParaMasterService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  const [id, setId] = useState(0);
  const [editedValues, setEditedValues] = useState([]);

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
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

  const getMasterService = async () => {
    setLoading(true);
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get(`http://127.0.0.1:3333/admin/masterservice`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((e) => {
          setParaMasterService(e.data.data);
          setLoading(false);
        });
      return response;
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMasterService();
  }, []);

  const getMasterById = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get(`http://127.0.0.1:3333/admin/masterservice/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((e) => {
          setEditedValues(e.data.data);
        });

      return response;
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    }
  };

  useEffect(() => {
    if (id > 0) {
      getMasterById();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios.patch(
        `http://127.0.0.1:3333/admin/masterservice/${id}`,
        editedValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );

      setToast(true);
      return;
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "price" ? parseFloat(value) : value;

    setEditedValues((prevValues) => ({
      ...prevValues,

      [name]: numericValue,
    }));
  };

  const table = () => {
    let filteredServices = paraMasterService;

    if (searchInput) {
      // If search input is not empty, filter services based on the name
      filteredServices = paraMasterService.filter((service) =>
        service.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (loading) {
      return (
        <tr className="p-10">
          <td>
            <span className="loading loading-dots text-black loading-lg"></span>
          </td>
          <td className="flex flex-row justify-center">
            <span className="loading loading-dots text-black loading-lg"></span>
          </td>
          <td>
            <span className="loading loading-dots text-black loading-lg"></span>
          </td>
          <td>
            <span className="loading loading-dots text-black loading-lg"></span>
          </td>
        </tr>
      );
    } else {
      return filteredServices.map((e, i) => {
        return (
          <tr
            className="text text-sm hover:bg-[#F0F0F0] cursor-pointer"
            key={i}
            onClick={() => {
              setId(e.id);
            }}
          >
            <th>{i + 1}</th>
            <th className="capitalize">{e.name}</th>
            <td className="capitalizeali">{e.type}</td>
            <td className="">{e.price}</td>
          </tr>
        );
      });
    }
  };

  return (
    <>
      <div className="w-full h-full px-3 flex flex-row">
        <div className="w-1/2 h-full flex flex-col">
          <div className="w-full h-16 border-b-2 shadow-md flex flex-row justify-between px-2 items-center">
            <span className="w-1/2 border-2 border-separate flex flex-row justify-between px-2 items-center rounded-md shadow-md">
              <input
                id="search"
                type="text"
                className="w-5/6 h-8 tracking-wider outline-none"
                placeholder="Cari Layanan"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <label htmlFor="search">
                <MdManageSearch className="text-xl cursor-pointer" />
              </label>
            </span>
            <span className="w-1/3 flex flex-row justify-end gap-3 items-center">
              <span
                className="text-2xl w-fit h-fit item-center justify-center cursor-pointer p-0"
                onClick={getMasterService}
              >
                <IoIosRefreshCircle className="text-2xl shadow-md rounded-full " />
              </span>
              <button
                className="w-fit  flex flex-row items-center text-2xl btn btn-sm  font-medium shadow-md bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED]"
                onClick={() =>
                  document.getElementById("addService").showModal()
                }
              >
                <p className="text-sm ">Tambah</p>
                <IoMdAddCircleOutline />
              </button>
            </span>
          </div>
          <div className="max-h-[500px] w-full shadow-md overflow-y-auto overflow-x-hidden">
            <table className="table border-colapse bg-3 text px-1">
              <thead className="sticky -top-1  border-b-2 text-bold text-black text-md m-0 bg-white  ">
                <tr className="border-b-2">
                  <th className="p-2 w-1/12 border-b-2 px-4">No.</th>
                  <th className="p-2 w-auto border-b-2 px-4">Nama</th>
                  <th className="p-2 w-1/4 border-b-2 px-4">Jenis</th>
                  <th className="p-2 w-1/5 b-2 px-4">Harga</th>
                </tr>
              </thead>
              <tbody className="">{table()}</tbody>
            </table>
            {paraMasterService.length < 1 ? (
              <>
                <span className="w-full h-10 text-center items-center flex flex-row justify-center">
                  tidak ada data
                </span>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="w-1/2 h-ful">
          <div className="w-full h-16 border-b-2 shadow-sm flex flex-row text-lg justify-between px-3 items-center">
            <p>Pendapatan dari layanan ini : </p>
            <p>Rp. {editedValues.count}</p>
          </div>
          <div className="w-full px-4 flex flex-col items-center shadow-md py-3">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3  h-full list-none"
            >
              <div className="w-full flex flex-col gap-3 items-end">
                <li className="w-full flex flex-col  pr-4 ">
                  <label htmlFor="name" name="name">
                    Nama :
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleInputChange}
                    value={editedValues.name}
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
                    onChange={handleInputChange}
                    value={editedValues.type}
                    className="w-full h-8 ring-1 mt-2 px-3 pr-5 rounded-md shadow-md"
                    required
                  >
                    <option value="default">Pilih Type</option>
                    <option value="service">Layanan</option>
                    <option value="medicine">Obat</option>
                    <option value="registration">Registrasi</option>
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
                    onChange={handleInputChange}
                    value={editedValues.price}
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
              <div className="modal-action flex flex-row justify-end items-center p-1 pr-2">
                <button
                  type="submit"
                  className="btn btn-sm shadow-lg font-medium bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn bg-[#FFFFFF] text-[#E64D4D] border-[#E64D4D] hover:bg-[#E64D4D] hover:text-[#FFFFFF] font-medium shadow-lg  btn-sm "
                  onClick={() =>
                    document.getElementById("delete_clinic").showModal()
                  }
                >
                  <FaTrashAlt />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AddService />
      {toast ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Berhasil mengubah layanan</span>
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
      <DeleteClinic
        id={id}
        name={editedValues.name}
        url={"admin/masterservice/delete"}
      />
    </>
  );
};
