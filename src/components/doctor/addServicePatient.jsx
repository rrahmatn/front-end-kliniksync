import axios from "axios";
import React, { useEffect, useState } from "react";

const AddServicePatient = ({
  masterServiceId,
  medicalHistoryId,
  patientName,
  serviceName,
  role
}) => {
  const addServicePatient = async () => {
    if (masterServiceId !== 0 || medicalHistoryId !== 0) {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;
      const body = {
        master_service_id: masterServiceId,
        medical_history_id: medicalHistoryId,
      };
      try {
        const response = await axios.post(
          `http://127.0.0.1:3333/${role}/service`,
          body,
          {
            headers: {
              "Content-Type": "application/json", // Adjust the content type based on your API requirements
              Authorization: `Bearer ${at}`,
            },
          }
        );

        document.getElementById("addServiceForPatient").checked = false
        return response;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="addServiceForPatient"
        className="modal-toggle"
      />
      <div className="modal" id="addServiceForPatient2">
        <div className="modal-box h-fit flex flex-col items-center ">
          <label
            htmlFor="addServiceForPatient"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="w-full flex flex-col mb-4 pl-4 pr-3 pt-4 justify-evenly text-md">
            Anda yakin menambahkan {serviceName} pada {patientName}
          </div>
          <div className="w-full flex justify-end items-center gap-2">
            <button
              className="btn bg btn-sm text-sm font-medium hover:bg-violet-400 hover:text-zinc-700"
              onClick={addServicePatient}
            >
              tambah
            </button>
            <label
              className="btn btn-sm text-sm  font-medium btn-warning"
              htmlFor="addServiceForPatient"
            >
              BATAL
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="addServiceForPatient">
          Close
        </label>
      </div>
    </>
  );
};

export default AddServicePatient;
