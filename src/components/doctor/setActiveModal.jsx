import axios from "axios";
import React, { useState } from "react";

const SetActiveModal = ({ status }) => {
  const setStatus = async () => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;
      const response = await axios.get(
        `http://127.0.0.1:3333/doctor/getactive/${status}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );
      document.getElementById("setActive").close();

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <dialog id="setActive" className="modal">
        <div className="modal-box p-4 gap-3">
          <span className="font-medium text-lg flex flex-col gap-3 px-1">
            {status === "false" ? (
              <p>Anda yakin ingin menonaktifkan mode kerja ?</p>
            ) : (
              <p>Aktifkan mode kerja ?</p>
            )}
            {status === "false" ? (
              <p className="text-sm italic text-red-600">
                Anda tidak akan menerima antrian dimode ini
              </p>
            ) : (
              <p className="text-sm italic">
                Anda akan mulai mendapatkan antrian ketika mengaktifkan mode
                kerja 
              </p>
            )}
          </span>
          <div className="w-full flex flex-row gap-3 mt-3 justify-end -mb-2">
            <button
              className="btn btn-sm font-medium bg-warning"
              onClick={() => {
                document.getElementById("setActive").close();
              }}
            >
              {" "}
              Batal
            </button>
            <button
              className="btn btn-sm font-medium bg-red-500"
              onClick={setStatus}
            >
              {" "}
              Lanjutkan
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>batal</button>
        </form>
      </dialog>
    </>
  );
};

export default SetActiveModal;
