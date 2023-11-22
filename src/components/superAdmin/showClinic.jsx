import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import DetailModal from "../detailModal";
import { IoIosRefreshCircle } from "react-icons/io";
import { MdManageSearch } from "react-icons/md";
import EditClinicModal from "../editCliniModal";

const ShowClinic = () => {
  const [paraClinic, setParaClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [cookies] = useCookies(["name"]);
  const [id, setId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const clinics = async () => {

    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get(`http://127.0.0.1:3333/superadmin/clinic`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((response) => {
          setParaClinics(response.data.data);
          setFilteredClinics(response.data.data);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    clinics();
  }, []);

  useEffect(() => {
    // Filter clinics based on search term
    const filtered = paraClinic.filter((clinic) =>
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClinics(filtered);
  }, [searchTerm, paraClinic]);

  return (
    <>
      <div className="w-full h-fit p-2 flex flex-col items-center">
        <div className="w-full px-16 mb-5 py-1">
          <h2 className="capitalize font-bold">Selamat Datang {cookies.name}</h2>
          <h2 className=" text-md ">Data Klinik </h2>
        </div>
        <div className="w-full px-16 mb-3 shadow-sm py-1 border-b-2 flex flex-row justify-between  ">
          <span className="w-1/3  border-2 border-separate flex flex-row justify-between px-2 items-center rounded-md shadow-md">
            <input
              id="search"
              type="text"
              className="w-5/6 h-8 tracking-wider outline-none"
              placeholder="Cari Klinik"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label htmlFor="search">
              <MdManageSearch className="text-xl cursor-pointer" />
            </label>
          </span>
          <span className=" text-2xl w-fit h-full item-center justify-center cursor-pointer" onClick={clinics}>
            <IoIosRefreshCircle className="text-2xl shadow-md rounded-full" />
          </span>
        </div>
        <div className="max-h-96 w-11/12 shadow-md overflow-y-auto overflow-x-hidden">
          <table className="table  border-colapse bg-3 text px-1">
            <thead className="sticky -top-1  border-b-2 text-bold text-black text-md m-0 bg-white  ">
              <tr className="border-b-2">
                <th className="p-2 w-1/12 border-b-2 px-4">No.</th>
                <th className="p-2 w-1/4 border-b-2 px-4">Name</th>
                <th className="p-2 w-1/3 border-b-2 px-4">Pemilik</th>
                <th className="p-2 w-1/6 border-b-2 px-4">Type</th>
                <th className="p-2 w-1/12 border-b-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredClinics.map((e, i) => {
                return (
                  <tr className="text" key={e.id}>
                    <th>{i + 1}</th>
                    <th className="capitalize">{e.name}</th>
                    <td className="capitalize">{e.owner}</td>
                    <td className="capitalize">{e.type}</td>
                    <td className="flex flex-row ml-auto gap-1 px-1">
                      <label
                        htmlFor="my_modal_7"
                        className="btn text-[10px] cursor-pointer  flex items-center justify-center  text-white btn-xs bg-blue-700"
                        onClick={() => setId(e.id)}
                      >
                        Detail
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <DetailModal id={id} />
      <EditClinicModal id={id}  />
    </>
  );
};

export default ShowClinic;
