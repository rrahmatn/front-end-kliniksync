import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import UserModal from "../../components/userModal";
  import { FiRefreshCcw } from "react-icons/fi";
import { MdManageSearch } from "react-icons/md";
import axios from "axios";
import { parseISO } from "date-fns";
import { useFormik } from "formik";
import AddPatient from "../../components/receptionist/addPatient";
import AddQueue from "../../components/receptionist/addQueue";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

const Receptionist = () => {
  const [selected, setSelected] = useState(false);
  const [phone, setPhone] = useState("");
  const [patients, setPatients] = useState([]);
  const [id, setId] = useState(0);
  const [patientName, setPatientName] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toast2, setToast2] = useState(false);
  const [queue, setQueue] = useState(0);

  const navigate = useNavigate();
  const [cookie] = useCookies(["role"]);
  useEffect(() => {
    if(!cookie.role || cookie.role === undefined){
      navigate(`/auth`);
    }else{
      if (cookie.role !== "receptionist") {
        navigate(`/${cookie.role}`);
      }
    }
  }, []);

  useEffect(() => {
    if (toast2) {
      setTimeout(() => {
        setToast2(false);
      }, 1500);
      searchPatient();
    }
  }, [toast2]);

  useEffect(() => {
    if (toast2) {
      setToast(false);
    }
    if (toast) {
      setTimeout(() => {
        setToast(false);
      }, 1500);
    }
  }, [toast, toast2]);

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  }, [error]);

  useEffect(() => {
    allQueue();
  }, []);

  const allQueue = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;

    try {
      const response = await axios
        .get(`http://127.0.0.1:3333/receptionist/allqueue`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((res) => {
          setQueue(res.data.data);
        });

      return;
    } catch (error) {
      return setError(error.response.data.message);
    }
  };

  const searchPatient = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;

    try {
      if (phone === "") {
        return setError("masukan nomor telepon terlebih dahulu");
      }
      const response = await axios.get(
        `http://127.0.0.1:3333/receptionist/patient/${phone}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const formattedPatients = response.data.data.map((patient) => ({
          id: patient.id,
          nik : patient.nik,
          name: patient.name,
          phone: patient.phone,
          birth_date: new Date(patient.birth_date).toISOString().split("T")[0],
          gender: patient.gender,
          address: patient.address,
        }));

        setPatients(formattedPatients);
        setToast(true);
        formik.setValues({
          nik: "",
          name: "",
          phone: "",
          gender: "",
          birth_date: "",
          address: "",
        });
        setSelected(false);
      } else {
        setPatients([]);
        setToast(false);
        setError("No data found");
      }

      setToast(true);
      return response;
    } catch (err) {
      setPatients([]);
      return setError(err.response.data.message);
    }
  };

  function calculateAge(birthDate) {
    const birthDateObj = parseISO(birthDate);
    const now = new Date();
    const diffInMilliseconds = now - birthDateObj;
    const ageDate = new Date(diffInMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

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
        if (id < 1) {
          setError("pilih data pasien terlebih dahulu");
          return;
        }
        const response = await axios.patch(
          `http://127.0.0.1:3333/receptionist/patient/${id}`,
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
          nik : "",
          name: "",
          phone: "",
          birth_date: "",
          gender: "",
          address: "",
        });

        return response;
      } catch (err) {
        setToast2(false);
        setError(err.response.data.message);
      }
    },
  });

  return (
    <>
      <div className="w-full h-screen flex flex-row pt-20">
        <aside className="w-1/3 min-w-[260px] pl-5 h-full flex flex-col">
          <form
            onSubmit={searchPatient}
            className="w-full mt-3 border-2 border-separate flex flex-row justify-between px-2 items-center rounded-md shadow-md"
          >
            <input
              id="search"
              type="text"
              className="w-5/6 h-8 text-sm tracking-wider outline-none"
              placeholder="Masukan Nomor Telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button type="submit" htmlFor="search">
              <MdManageSearch className="text-xl cursor-pointer" />
            </button>
          </form>

          <p className={`text-xs pl-2 py-2 italic`}>
            {" "}
            cari pasien berdasarkan nomor telepon
          </p>
          <div className="w-full max-h-[460px] h-full pb-4 px-1 overflow-y-scroll">
            {patients.map((e, i) => {
              const age = calculateAge(e.birth_date);
              const patientWithAge = { ...e, age };
              return (
                <div
                  className="rounded-md border-b-2 border-stone-400  w-full h-20 bg-base-100  shadow-lg hover:bg-slate-200"
                  key={i}
                  onClick={() => {
                    setSelected(true);
                    setPatientName(e.name);
                    setId(e.id);
                    console.log(e)
                    formik.setValues({
                      nik: e.nik,
                      name: e.name,
                      birth_date: e.birth_date,
                      phone: e.phone,
                      gender: e.gender,
                      address: e.address,
                    });
                  }}
                >
                  <span className="flex flex-col pl-4 pr-2 pb-1 pt-2 mt-1 w-full cursor-pointer  h-full">
                    <h2 className="card-title capitalize tracking-wider text-sm">
                      {e.name}
                    </h2>
                    <span className="flex flex-row items-center w-full justify-between">
                      <p className="text-xs capitalize">{e.gender}</p>
                      <p className="text-md font-bold capitalize">
                        {patientWithAge.age}
                      </p>
                    </span>
                    <p className="text-xs capitalize line-clamp-1 h-fit">
                      {formatDate(e.birth_date)}
                    </p>
                  </span>
                </div>
              );
            })}
          </div>
        </aside>
        <section className="w-full gap-2 h-full flex flex-col">
          <nav className="w-full h-14 shadow-md border-b-2 px-2 justify-between flex flex-row items-center rounded-lg border-stone-300 mb-2">
            <h3 className="text-md tracking-wider">Informasi Pasien</h3>
            <label
              onClick={() => document.getElementById("addPatient").showModal()}
              className="btn btn-sm bg font-medium shadow-md"
            >
              Tambah Pasien
            </label>
          </nav>
          {selected ? (
            <div className="w-full h-2/3">
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-3  h-full list-none"
              >
                <div className="w-full h-fit flex flex-row px-4">
                  <div className="w-1/2 flex flex-col gap-3 items-end">
                    <li className="w-full flex flex-col  pr-4 ">
                      <label htmlFor="nik" name="nik">
                        Nik :
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
                      <span className="w-full flex flex-row justify-between">
                        <label htmlFor="birth_date" name="birth_date">
                          Tanggal Lahir :
                          <span className="w-full ml-auto text-center text-xs italic p-0 tracking-wider">
                            {" "}
                            bulan/tanggal/tahun
                          </span>
                        </label>
                      </span>
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
                    <li className="w-full flex  flex-col pr-4 ">
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

                    <li className="w-full flex flex-col pr-4 mt-2">
                      <label htmlFor="address" name="address">
                        Alamat :
                      </label>
                      <textarea
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address}
                        id="address"
                        name="address"
                        className="w-full h-44 p-2 ring-1 mt-2 px-3 rounded-md shadow-md"
                        required
                      />
                    </li>
                  </div>
                </div>
                <div className="modal-action   flex flex-row justify-end items-center p-3 pr-2">
                  <button
                    type="submit"
                    className="btn btn-sm shadow-lg font-medium bg-[#FFFFFF] text-[#8AD1F2] border-[#8AD1F2] hover:bg-[#E5F3FF]"
                  >
                    Edit Data Pasien
                  </button>
                  <label
                    htmlFor="addQueue"
                    onClick={() =>
                      document.getElementById("addQueue").showModal()
                    }
                    type="button"
                    className="btn bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED] font-medium shadow-lg  btn-sm "
                  >
                    Pilih Antrian Dokter
                  </label>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg italic">
              {" "}
              <p>Silahhkan cari dan pilih data pasien terlebih dahulu</p>
            </div>
          )}
        </section>
        <div className="w-1/3 h-full gap-3 flex flex-col py-4 px-1 items-center">
          <span className="text-lg">Jumlah antrian saat ini :</span>

          <span className="text-2xl w-16 flex items-center font-bold shadow-lg border-b-2 border-slate-300 justify-center h-16 bg-violet-300 rounded-full">{queue}</span>
          <span className="text-xl hover:bg-yellow-400 hover:text-slate-100  w-10 cursor-pointer flex items-center font-bold shadow-lg border-b-2 border-slate-300 justify-center h-10 bg-yellow-300 rounded-full"
          onClick={allQueue}
          ><FiRefreshCcw /></span>   
        </div>
      </div>
      {toast ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Data ditemukan {patients.length} pasien</span>
          </div>
        </div>
      ) : (
        ""
      )}
      {toast2 ? (
        <div className="toast toast-top z-[1000] toast-center">
          <div className="alert alert-success">
            <span>Berhasil mengubah data pasien</span>
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
      <Navbar />
      <UserModal />
      <AddPatient />
      <AddQueue patientId={id} patientName={patientName} />
    </>
  );
};

export default Receptionist;
