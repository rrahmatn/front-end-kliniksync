import Navbar from "../../components/navbar";
import UserModal from "../../components/userModal";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import axios from "axios";
import { IoMdRefreshCircle } from "react-icons/io";
import { useReactToPrint } from "react-to-print";

const Cashier = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies(["role"]);
  useEffect(() => {
    if (!cookie.role || cookie.role === undefined) {
      navigate(`/auth`);
    } else {
      if (cookie.role !== "cashier") {
        navigate(`/${cookie.role}`);
      }
    }

    getQueue();
    setResult([]);
    setServiceCounts({});
  }, []);
  const [iniId, setIniId] = useState(0);
  const [queue, setQueue] = useState([]);
  const [patient, setPatient] = useState({
    patient: {
      name: "",
    },
  });
  const [service, setService] = useState([]);
  const [total, setTotal] = useState(0);
  const [bill, setBill] = useState(false);
  const [doctorPrice, setDoctorPrice] = useState(0);
  const [service2, setService2] = useState([]);

  const getQueue = async () => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;
      const response = await axios
        .get(`http://127.0.0.1:3333/cashier/queue`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((res) => {
          setQueue(res.data.queue);
        });
      // console.log(next);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getPatient = async (id) => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;
      const response = await axios
        .get(`http://127.0.0.1:3333/cashier/medicalhistory/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((res) => {
          setResult([]);
          setServiceCounts({});
          setPatient(res.data.data);
          setService(res.data.data.services);
          setDoctorPrice(res.data.data.doctor.price);

          return res.data.data.services;
        })
        .then((e) => {
          const x = e.filter((e) => e.type !== "medicine");
          setService2(x);
        });
      // console.log(next);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getDone = async () => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;
      const response = await axios.patch(
        `http://127.0.0.1:3333/cashier/medicalhistory/${iniId}`,
        { iniId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const [serviceCounts, setServiceCounts] = useState({});
  const [result, setResult] = useState([]);
  const [debit, setDebit] = useState(0);
  const [kembalian, setKembalian] = useState(0);

  useEffect(() => {
    if (debit !== 0) {
      setKembalian(debit - total);
    } else {
      setKembalian(0);
    }
  }, [debit, bill]);

  useEffect(() => {
    setTotal(service.reduce((total, e) => total + e.price, doctorPrice));
    const x = bill ? service : service2;

    x.forEach((service) => {
      setServiceCounts((prevCounts) => ({
        ...prevCounts,
        [service.name]: (prevCounts[service.name] || 0) + 1,
      }));
    });
  }, [service, bill , iniId ]);

  useEffect(() => {
    setResult(() => {
      return Object.entries(serviceCounts).map(([name, count]) => {
        const serviceObject = service.find((s) => s.name === name);
        const price = serviceObject ? serviceObject.price : 0;
        const reversedPrice = `${price} x ${count}`;
        return {
          name: name,
          reversedPrice: reversedPrice,
        };
      });
    });
  }, [serviceCounts, service, bill]);

  const componentRef = useRef();

  // Gunakan useReactToPrint di dalam komponen utama
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (bill) {
      setTotal(service.reduce((total, e) => total + e.price, doctorPrice));
    } else {
      setTotal(service2.reduce((total, e) => total + e.price, doctorPrice));
    }
  }, [bill]);

  const recept = () => {
    const x = service.filter(e => e.type === "medicine")
    return (
      <>
      <div className="w-full border-t-2 py-2 text-[10px]">Resep Dokter : </div>
       <div className="w-full h-fit flex flex-row gap-2 flex-wrap justify-center text-xs">
        {x.map((e,i)=> <p key={i}>{e.name}</p>)}
      </div>
      </>
     
    );
  };

  return (
    <>
      <div className="w-full h-screen flex flex-row pt-20">
        <aside className="w-1/4 h-full  flex flex-col">
          <nav className="w-full h-fit py-4 tracking-wider text-center border-b-2 border-violet-400 rounded-md text-slate-700 bg shadow-md flex items-center justify-center gap-2">
            Daftar Antrian
            <IoMdRefreshCircle
              className=" text-stone-600 cursor-pointer rounded-full text-xl"
              onClick={getQueue}
            />
          </nav>
          <div className="w-full max-h-full shadow-md overflow-y-auto overflow-x-hidden gap-2 h-full flex flex-col px-2 py-3">
            {queue.length > 0 ? (
              queue.map((e, i) => {
                return (
                  <div
                    className="w-full h-16 flex flex-row items-center border justify-between px-2 py-2 cursor-pointer rounded-md shadow-md shadow-yellow-100 hover:bg-slate-300"
                    key={i}
                    onClick={async () => {
                      await setResult([]);
                      await setServiceCounts({});
                      getPatient(e.data.id);
                      setIniId(e.data.id);
                      setDoctorPrice(0);
                      setDebit(0);
                      setBill(true);
                      setTotal(0);
                    }}
                  >
                    <div className="w-2/3 overflow-x-hidden overflow-y-hidden h-full flex flex-col gap-1 shrink-0 px-3 ">
                      <h4>{e.name}</h4>
                      <p className="text-xs">{e.address}</p>
                    </div>
                    <MdOutlineArrowForwardIos className="text-2xl font-bold" />
                  </div>
                );
              })
            ) : (
              <span className="text-xs italic w-full h-20 m-auto text-center">
                {" "}
                tidak ada antrian untuk saat ini
              </span>
            )}
          </div>
        </aside>
        <aside className="w-1/2 h-full flex flex-col">
          {patient.patient.name !== "" ? (
            <div
              className="w-auto py-2 h-full mb-5  mx-4 flex flex-col items-center nota px-7 justify-between border-[0.2px] border-black"
              ref={componentRef}
            >
              <span className="w-full h-20 gap-2 flex flex-col justify-center items-center border-b-2 pb-2">
                <span className="text-sm uppercase font-bold">Kimia farma</span>
                <span className="text-xs  w-1/3 h-fit flex flex-warp text-center ">
                  jalan haji subrata no 123 dekat gedung sate cianjur
                </span>
              </span>

              <table className="text-xs mt-6 pl-16 h-full flex flex-col w-full text-center">
                <thead>
                  <tr>
                    <th className="w-1/3 py-1 text-left">No. Resi</th>
                    <th>:</th>
                    <th className="w-full text-right pr-10">
                      {patient.data.id}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="py-4">
                    <td className="w-1/3 py-1 text-left">Waktu</td>
                    <td>:</td>
                    <td className="w-full text-right pr-10">{`${
                      patient.data.updated_at.split("T")[0]
                    } / ${patient.data.updated_at.split("T")[1]} `}</td>
                  </tr>
                  <tr className="py-4">
                    <td className="w-1/3 py-1 text-left">Nama Dokter</td>
                    <td>:</td>
                    <td className="w-full text-right pr-10 capitalize">
                      {patient.doctor.name}
                    </td>
                  </tr>
                  <tr className="py-4">
                    <td className="w-1/3 py-1 text-left">Nama Pasien</td>
                    <td>:</td>
                    <td className="w-full text-right pr-10 capitalize">
                      {patient.patient.name}
                    </td>
                  </tr>
                  <tr className="py-4">
                    <th className="w-1/3 py-1 text-left">Detail</th>
                    <th>:</th>
                    <th className="w-full text-right pr-10"></th>
                  </tr>
                  <tr className="py-2 h-max align-top text-[10px] mt-10">
                    <td className="w-1/3 pl-4 text-left">Biaya Dokter</td>
                    <td>:</td>
                    <td className="w-full text-right pr-10">{doctorPrice}</td>
                  </tr>
                  {result.map((e, i) => (
                    <tr className="py-2 text-[10px]" key={i}>
                      <td className="w-1/3 pl-4 text-left">{e.name}</td>
                      <td>:</td>
                      <td className="w-full text-right pr-10">
                        {e.reversedPrice}
                      </td>
                    </tr>
                  ))}

                  <tr className="py-2 h-max align-top text-[10px] border-t-[0.5px] border-black mt-10">
                    <td className="w-1/3 pl-4 text-left">Total</td>
                    <td>:</td>
                    <td className="w-full text-right pr-10">{total}</td>
                  </tr>
                  <tr className="py-10 h-20 align-top text-[10px] mt-10">
                    <td className="w-1/3 text-left">.</td>
                    <td>.</td>
                    <td className="w-full text-right pr-10">.</td>
                  </tr>
                 

                  <tr className="py-2 h-max align-top text-[10px] mt-10">
                    <td className="w-1/3 text-left">Catatan</td>
                    <td>:</td>
                    <td className="w-full text-right pr-10">
                      {patient.data.note}
                    </td>
                  </tr>
                  <tr className="py-2 h-max align-top text-[10px]">
                    <td className="w-1/3 text-left"></td>
                    <td></td>
                    <td className="w-full text-right pr-10 ">
                      {patient.data.medicine}
                    </td>
                  </tr>
                </tbody>
              </table>
              {bill ? (
                   ""
                  ) : (
                    recept()
                  )}

              <div className="w-full h-fit text-center flex flex-col text-sm mt-10">
                <p>Terima Kasih</p>
              </div>
            </div>
          ) : (
            <span className="w-full h-full flex items-center justify-center">
              <span className="loading loading-infinity loading-lg"></span>
            </span>
          )}
        </aside>
        <aside className="w-1/4 h-full  flex flex-col items-center gap-4 py-6">
          <li className="w-11/12 flex flex-col gap-1">
            <label htmlFor="total">Total</label>
            <input
              name="total"
              className="text-sm shadow-md border w-full p-2 h-10 placeholder:lowercase no-spin"
              id="total"
              type="number"
              disabled
              value={total}
            />
          </li>
          <li className="w-11/12 mt-3 flex flex-col gap-1">
            <label htmlFor="kembalian">Kembalian</label>
            <input
              name="kembalian"
              className="text-sm shadow-md border w-full p-2 h-10 placeholder:lowercase no-spin"
              id="kembalian"
              value={kembalian}
              type="number"
              min={0}
              disabled
            />
          </li>
          <li className="w-11/12 mt-3 flex flex-col gap-1">
            <label htmlFor="debit">Debit</label>
            <input
              name="debit"
              className="text-sm shadow-md border w-full p-2 h-10 placeholder:lowercase no-spin"
              id="debit"
              type="number"
              value={debit}
              onChange={(e) => setDebit(e.target.value)}
            />
          </li>

          <button className="btn bg-[#55add4] text-[#FFFFFF] hover:bg-[#328bb3] w-11/12" onClick={handlePrint}>
            print
          </button>
          <button
            className="btn bg-[#3d9458] text-[#FFFFFF] hover:bg-[#2d8749] w-11/12"
            onClick={async () => {
              await setResult([]);
              await setServiceCounts({});
              setBill(!bill);
            }}
          >
            {bill ? "tebus diluar" : "tebus obat"}
          </button>
          <button
            className="btn bg-[#dc3545] text-[#FFFFFF] hover:bg-[#c82333] w-11/12"
            onClick={() => {
              getDone();
              getQueue();
              setKembalian(0);
              setTotal(0);
              setResult([]);
              setServiceCounts({});
              setPatient({
                patient: {
                  name: "",
                },
              });
              setQueue([]);
              setIniId(0);
            }}
          >
            Selesai
          </button>
        </aside>
      </div>
      <Navbar />
      <Navbar />
      <UserModal />
    </>
  );
};

export default Cashier;
