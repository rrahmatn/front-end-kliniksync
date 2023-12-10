import Navbar from "../../components/navbar";
import UserModal from "../../components/userModal";
import { FaCircleArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { IoMdRefreshCircle } from "react-icons/io";
import SetActiveModal from "../../components/doctor/setActiveModal";
import MedicalHistory from "../../components/doctor/medicalHistoryModal";
import { GrUserFemale } from "react-icons/gr";
import { GrUser } from "react-icons/gr";
import { parseISO } from "date-fns";
import { IoIosAddCircle } from "react-icons/io";
import { MdManageSearch } from "react-icons/md";
import AddServicePatient from "../../components/doctor/addServicePatient";
import { useFormik } from "formik";
import { IoSearchSharp } from "react-icons/io5";

const Pharmacy = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies(["role"]);
  const [queue, setQueue] = useState(0);
  const [status, setStatus] = useState(true);
  const [next, setNext] = useState({
    id: 0,
    name: " ",
  });
  const [nextId, setNextId] = useState(0);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [patient, setPatient] = useState({
    name: "",
    birth_date: "",
    address: "",
    gender: "",
  });
  const [medicalHistoryId, setMedicalHistoryId] = useState(0);
  const [masterService, setMasterService] = useState([
    {
      name: " ",
      id: 0,
    },
  ]);
  const [filteredMS, setFilterMS] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [service, setService] = useState("");
  const [serviceId, setServiceId] = useState(0);
  const [patientMSId, setPatientMSId] = useState(0);

  useEffect(() => {
    if (!cookie.role || cookie.role === undefined) {
      navigate(`/auth`);
    } else {
      if (cookie.role !== "pharmacy") {
        navigate(`/${cookie.role}`);
      }
    }
  }, []);

  useEffect(() => {
    getQueue();
    getMasterService();
  }, []);

  useEffect(() => {
    getQueue();
  }, [nextId]);

  const getQueue = async () => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;
      const response = await axios
        .get(`http://127.0.0.1:3333/pharmacy/queue`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((res) => {
          setQueue(res.data.queue.length);
          setNext(res.data.queue[1]);
          setPatientMSId(res.data.queue[0].data.id);
          setPatient({
            name: res.data.queue[0].name,
            address: res.data.queue[0].address,
            birth_date: res.data.queue[0].birth_date,
            gender: res.data.queue[0].gender,
          });
          formik.setValues({
            note: res.data.queue[0].data.note,
            medicine: res.data.queue[0].data.medicine,
          });
        });
      // console.log(next);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  function calculateAge(birthDate) {
    const birthDateObj = parseISO(birthDate);
    const now = new Date();
    const diffInMilliseconds = now - birthDateObj;
    const ageDate = new Date(diffInMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const getMasterService = async () => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;

      const response = await axios
        .get(`http://127.0.0.1:3333/pharmacy/service`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((res) => {
          setMasterService(res.data.service);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Filter clinics based on search term
    const filtered = masterService.filter((e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterMS(filtered);
  }, [searchTerm, masterService]);

  const formik = useFormik({
    initialValues: {
      medicine: "",
      note: "",
    },

    onSubmit: async (values) => {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;

      try {
        const response = await axios
          .patch(
            `http://127.0.0.1:3333/pharmacy/medicalhistory/${patientMSId}`,
            values,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${at}`,
              },
            }
          )
          .then((res) => {
            setNextId(0);
            document.getElementById("getDonePharmacy").close();
            setNext({
              id: 0,
              name: "",
            });
            setPatient({
              name: "",
              address: "",
              birth_date: "",
              gender: "",
            });
          })
          .then(async () => await getQueue());

        formik.resetForm();

        return response;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <div className="w-full h-screen flex pt-16 flex-col">
        <nav className="w-full h-14  rounded pt-3 px-3 flex items-center flex-row gap-3 justify-between">
          <div className="w-fit h-full flex flex-row items-center gap-2">
            <div className="w-7 h-7  shadow-md bg-amber-400 text-gray-900 text-sm items-center justify-center flex rounded-full text-center tracking-wider">
              {queue ? queue - 1 : "0"}
            </div>
            {next ? (
              <>
                <div className="w-fit h-fit badge py-1 px-2 bg text-center text-sm italic tracking-wider">
                  {next.name ? next.name : " "}
                </div>
              </>
            ) : (
              <span className="text-xs">
                Anda tidak punya antrian untuk saat ini
              </span>
            )}

            <IoMdRefreshCircle
              className="bg-violet-100 text-stone-600 cursor-pointer rounded-full text-xl"
              onClick={getQueue}
            />
          </div>
        </nav>
        <div className="w-full h-full flex flex-row">
          <aside className="w-2/3 px-2 h-full  flex flex-col">
            <nav className="w-full  h-1/4 mb-1 flex flex-col border-b-2 rounded-md shadow-md">
              {patient.name !== "" ? (
                <>
                  <span className="w-full h-1/2 flex flex-row px-8 pt-2 text-xl justify-between items-center">
                    <span className="w-1/2 h-full  gap-3 tracking-wider  flex flex-row items-center capitalize text-md">
                      {patient.gender === "perempuan" ? (
                        <GrUserFemale className="text-4xl bg   rounded-full p-1 h-9 w-9" />
                      ) : (
                        <GrUser className="text-4xl bg rounded-full   p-1 h-9 w-9" />
                      )}
                      {patient.name ? patient.name : " "}
                    </span>
                    <span className="w-full h-1/2 flex flex-row px-8 text-xl justify-end">
                      {patient.birth_date
                        ? calculateAge(patient.birth_date)
                        : ""}
                    </span>
                  </span>
                  <span className="w-full h-1/2 flex flex-row px-9 text-xl justify-between items-center">
                    <span className="w-1/2 h-full  pl-14 tracking-wider flex flex-row  capitalize text-sm">
                      {patient.gender}
                    </span>
                    <span className="w-full h-1/2 flex flex-row px-4 text-sm  justify-end items-end">
                      {patient.address}
                    </span>
                  </span>
                </>
              ) : (
                <span className="w-full h-full flex flex-row items-center justify-center">
                  Tidak ada antrian untuk saat ini
                </span>
              )}
            </nav>
            <section className="w-full  h-full  rounded-md shadow-md flex flex-row">
              <div className="w-full h-full py-2 pt-4 text-md px-2">
                <span className="pl-3 my-1">Tambahkan Layanan</span>
                <span className="w-1/2 flex flex-row items-center gap-3 mt-3">
                  <input
                    id="search"
                    type="text"
                    className="w-5/6 h-8 tracking-wider outline-none   border-2 border-separate flex flex-row justify-between px-2 items-center rounded-md shadow-md"
                    placeholder="Cari Layanan"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label htmlFor="search" className=" flex items-center justify-center w-7 h-7 shadow-md border rounded-full bg">
                    <IoSearchSharp className="text-xl cursor-pointer"  />
                  </label>
                </span>
                <div className="w-full mt-2 max-h-80 shadow-md overflow-y-auto overflow-x-hidden h-full">
                  <table className="table w-full  border-colapse bg-3 text px-1 text-sm">
                    <thead className="sticky -top-1  border-b-2 text-bold text-black text-md m-0 bg-white  ">
                      <tr className="border-b-2">
                        <th className="p-2 w-1/12 border-b-2 px-4">No.</th>
                        <th className="p-2 w-/full border-b-2 px-4">Layanan</th>
                        <th className="p-2 w-1/4 border-b-2 px-4">Harga</th>
                        {patient.name !== "" ? (
                          <th className="p-2 w-1/6 border-b-2 px-4">
                            Tambahkan
                          </th>
                        ) : (
                          ""
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMS.map((e, i) => {
                        return (
                          <tr className="text" key={i + 1}>
                            <th>{i + 1}</th>
                            <td className="capitalize">{e.name}</td>
                            <td className="capitalize ">{e.price}</td>
                            {patient.name !== "" ? (
                              <td className="capitalize ">
                                <label
                                  onClick={() => {
                                    setServiceId(e.id);
                                    setService(e.name);
                                  }}
                                  htmlFor="addServiceForPatient"
                                  className="h-8 bg cursor-pointer w-8 mx-auto flex items-center justify-center rounded-full text-2xl p-1 hover:bg-violet-400 hover:text-zinc-900"
                                >
                                  <IoIosAddCircle />
                                </label>
                              </td>
                            ) : (
                              ""
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </aside>
          <aside className="w-1/3 px-3 h-full">
            {patient.name !== "" ? (
              <>
                <nav className="w-full h-fit flex items-center justify-center text-sm border-b-2 shadow-md px-2 py-4 rounded-md">
                  Tinggalkan catatan dan obat
                </nav>
                <div className="w-full h-fit flex py-3 flex-col">
                  <form
                    className="w-full h-fit list-none gap-2 pl-4"
                    onSubmit={formik.handleSubmit}
                  >
                    <li className="w-full flex flex-col gap-1">
                      <label htmlFor="note">Catatan:</label>
                      <span className="text-xs italic text-red-600">
                        anda tidak bisa mengubah catatan dari dokter
                      </span>
                      <textarea
                        name="note"
                        onChange={formik.handleChange}
                        value={formik.values.note}
                        className="text-sm shadow-md border   w-11/12 p-2 h-32 placeholder:lowercase"
                        id="note"
                        placeholder={`masukan catatan untuk ${patient.name}`}
                        disabled
                      />
                    </li>
                    <li className="w-full mt-3 flex flex-col gap-1">
                      <label htmlFor="medicine">Obat:</label>
                      <textarea
                        name="medicine"
                        onChange={formik.handleChange}
                        value={formik.values.medicine}
                        className="text-sm shadow-md border w-11/12 p-2 h-32 placeholder:lowercase"
                        id="medicine"
                        placeholder={`masukan kebutuhan obat untuk ${patient.name}`}
                        required
                      />
                    </li>

                    <label
                      htmlFor="getDonePharmacy"
                      onClick={() =>
                        document.getElementById("getDonePharmacy").showModal()
                      }
                      className="w-11/12 my-3 btn bg hover:bg-violet-400 hover:text-zinc-900 "
                    >
                      {" "}
                      Selesai
                    </label>
                    <dialog id="getDonePharmacy" className="modal">
                      <div className="modal-box p-4 gap-3">
                        <span className="font-medium text-lg flex flex-col gap-3 px-1">
                          <p>
                            Anda yakin sudah selesai untuk pemeriksaan{" "}
                            {patient.name} ?
                          </p>
                        </span>
                        <div className="w-full flex flex-row gap-3 mt-3 justify-end -mb-2">
                          <button
                            onClick={() =>
                              document.getElementById("getDonePharmacy").close()
                            }
                            type="button"
                            className="btn btn-sm font-medium bg-warning"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="btn btn-sm font-medium bg-red-500"
                          >
                            Lanjutkan
                          </button>
                        </div>
                      </div>
                    </dialog>
                  </form>
                </div>
              </>
            ) : (
              <span className="w-full h-full flex items-center justify-center">
                <span className="loading loading-infinity loading-lg"></span>
              </span>
            )}
          </aside>
        </div>
      </div>
      <Navbar />
      <UserModal />
      <SetActiveModal status={`${!status}`} />
      <MedicalHistory id={medicalHistoryId} />
      <AddServicePatient
        patientName={patient.name}
        serviceName={service}
        masterServiceId={serviceId}
        medicalHistoryId={patientMSId}
        role={`pharmacy`}
      />
    </>
  );
};

export default Pharmacy;
