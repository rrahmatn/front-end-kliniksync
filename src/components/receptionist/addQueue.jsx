import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoInformationCircleSharp } from "react-icons/io5";

const AddQueue = ({ patientId, patientName }) => {
  const [doctors, setDoctors] = useState([]);

  const [doctorName, setDoctorName] = useState("-");
  const [doctorId, setDoctorId] = useState(0);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
        setDoctorId(0);
        document.getElementById("addQueue").close();
      }, 2000);
    }
  }, [toast]);

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  }, [error]);

  const getDoctor = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get("http://127.0.0.1:3333/receptionist/doctor", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        })
        .then((res) => setDoctors(res.data.data));

      return response;
    } catch (error) {}
  };
  const handlerQueue = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;

    if (doctorId < 1) {
      return setError("pilih doktet terlebih dahulu");
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:3333/receptionist/queue",
        {
          id_patient: patientId,
          id_doctor: doctorId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );

      setToast(true);

      return response;
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (patientName !== "") {
      getDoctor();
    }
  }, [patientName]);

  return (
    <>
      <dialog id="addQueue" className="modal h-screen">
        <div className="w-5/6 bg-base-100 h-5/6 px-3 py-3  rounded-md shadow-xl justify-between flex flex-col">
          <div className="w-full h-16 border-b-2 p-2 rounded-md tracking-wider text-xl flex flex-row items-center shadow-md justify-between">
            <span>Daftar Dokter yang sedang aktif</span>
            <div
              className="tooltip text-xs italic tooltip-left"
              data-tip="jika tidak ada dokter yang ditemukan , pastikan mereka mengatifkan mode kerja"
            >
              <button className="btn bg-transparent btn-sm btn-circle text-yellow-700 text-2xl p-0">
                <IoInformationCircleSharp />
              </button>
            </div>
          </div>
          <div className="w-full h-full  overflow-x-hidden overflow-y-auto py-2">
            <div className="w-full h-fit max-h-full p-3 flex items-start justify-center lg:justify-start  flex-row flex-wrap gap-2">
              {doctors.map((e, i) => {
                return (
                  <>
                    <div
                      className="indicator mx-2"
                      key={i}
                      onClick={() => {
                        setDoctorId(e.id);
                        setDoctorName(e.name);
                      }}
                    >
                      <span className="indicator-item badge badge-accent">
                        {e.queue}
                      </span>
                      <div
                        className={`w-48 h-24 border-2 border-b-4  ${
                          doctorId === e.id
                            ? "bg-stone-200 border-slate-500"
                            : "border-slate-300"
                        } cursor-pointer flex flex-col gap-3 justify-center items-center rounded-md shadow-md hover:bg-stone-300 hover:text-slate-800`}
                      >
                        <span className="text-sm">{e.name}</span>
                        <span className="text-xs italic">{e.specialist}</span>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="w-full h-20 flex flex-row items-center justify-between">
            <span className="w-fit gap-4 flex flex-row px-3">
              <span className="text-sm">Pasien : {patientName}</span>
              <span className="text-sm">Dokter : {doctorName}</span>
            </span>

            <span className="gap-2 flex flex-row">
              <button
                onClick={() => {
                  setDoctorId(0);
                  document.getElementById("addQueue").close();
                }}
                className="btn btn-sm btn-error text-slate-900 font-medium"
              >
                batal
              </button>
              <button
                onClick={handlerQueue}
                className="btn btn-sm bg font-medium text-slate-900"
              >
                lanjutkan
              </button>
            </span>
          </div>
        </div>
        {toast ? (
          <div className="toast toast-top z-[1000] toast-center">
            <div className="alert alert-success">
              <span>
                Berhasil menambahkan {patientName} kedalam antrian {doctorName}
              </span>
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

export default AddQueue;
