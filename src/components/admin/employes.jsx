import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import DetailModal from "../detailModal";
import { IoIosRefreshCircle } from "react-icons/io";
import { MdManageSearch } from "react-icons/md";
import DetailEmploye from "../detailEmpoloye";
import AddEmployeModal from "../adminModal/AddEmploye";

export const Employes = () => {
  const [cookies] = useCookies(["name"]);
  const [id, setId] = useState(0);
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const [employes, setEmployes] = useState([]);

  const clinics = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios.get(`http://127.0.0.1:3333/admin/employes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${at}`,
        },
      });
      setEmployes(response.data.data.employes[0]);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    clinics();
  }, []);

  // Filter employes based on search term
  const filteredEmployes = employes.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-full h-fit pt-1 p-2 flex flex-col items-center">
        <div className="w-full px-16 mb-4 py-1">
          <h2 className="capitalize font-bold tracking-wide">
            Selamat Datang {cookies.name}
          </h2>
          <h2 className=" text-md ">Data Karyawan</h2>
        </div>
        <div className="w-full px-16 mb-3 shadow-sm py-1 border-b-2 flex flex-row justify-between mt-[10px] ">
          <span className="w-1/3 border-2 border-separate flex flex-row justify-between px-2 items-center rounded-md shadow-md mb-[10px]">
            <input
              id="search"
              type="text"
              className="w-5/6 h-8 tracking-wider outline-none"
              placeholder="Cari Karyawan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label htmlFor="search">
              <MdManageSearch className="text-xl cursor-pointer" />
            </label>
          </span>
          <span className="flex flex-row gap-9  items-center px-5">
            <label
              htmlFor="addEmploye"
              className="btn bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED] btn-sm font-medium text-md"
              onClick={() => document.getElementById("addEmploye").showModal()}
            >
              Tambah karyawan
            </label>
            <span
              className=" text-2xl w-fit h-fit item-center justify-center cursor-pointer"
              onClick={clinics}
            >
              <IoIosRefreshCircle className="text-2xl shadow-md rounded-full" />
            </span>
          </span>
        </div>
        <div className="max-h-96 w-11/12 shadow-md overflow-y-auto overflow-x-hidden">
          <table className="table  border-colapse bg-3 text px-1">
            <thead className="sticky -top-1  border-b-2 text-bold text-black text-md m-0 bg-white  ">
              <tr className="border-b-2">
                <th className="p-2 w-1/12 border-b-2 px-4">No.</th>
                <th className="p-2 w-auto border-b-2 px-4">Nama</th>
                <th className="p-2 w-1/4 border-b-2 px-4">Email</th>
                <th className="p-2 w-1/6 b-2 px-4">Posisi</th>
                <th className="p-2 w-1/12 border-b-2 px-4">Detail</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredEmployes.map((e, i) => {
                return (
                  <tr className="text" key={i + 1}>
                    <th>{i + 1}</th>
                    <th className="capitalize">{e.name}</th>
                    <td className="lowercase">{e.email}</td>
                    <td className="capitalize">{e.role}</td>
                    <td className="flex flex-row ml-auto gap-1 px-1">
                      <label
                        htmlFor="getEmploye"
                        className="btn text-[10px] cursor-pointer flex items-center justify-center btn-xs bg-[#FFFFFF] text-[#8AD1F2] border-[#8AD1F2] hover:bg-[#E5F3FF]"
                        onClick={() => {
                          setId(e.id);
                          setRole(e.role);
                        }}
                      >
                        Detail
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredEmployes.length < 1 ? (
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
      <DetailEmploye role={role} id={id} />
      <AddEmployeModal />
    </>
  );
};
