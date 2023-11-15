import React, { useEffect, useState } from "react";
import { MdManageSearch } from "react-icons/md";
import { IoIosRefreshCircle } from "react-icons/io";
import axios from "axios";
import { AddService } from "../adminModal/AddService";
import { IoMdAddCircleOutline } from "react-icons/io";

export const AdminService = () => {
  const [paraMasterService, setParaMasterService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

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
      console.log(err);
    }
  };

  useEffect(() => {
    getMasterService();
  }, []);

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
            className="text text-sm hover:bg-violet-800 hover:text-white cursor-pointer"
            key={i}
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
                className="w-fit  flex flex-row items-center text-2xl text-[#171f1f] btn btn-sm  font-medium shadow-md  bg"
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
          </div>
        </div>
        <div className="w-1/2 h-full bg-red-500">
          <div className="w-full h-16 border-b-2 shadow-md flex flex-row justify-between px-2 items-center">
            .
          </div>
        </div>
      </div>
      <AddService />
    </>
  );
};
