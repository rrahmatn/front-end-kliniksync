import axios from "axios";
import React, { useEffect, useState } from "react";

const MedicalHistory = ({ id }) => {
  const [content, setContent] = useState({
    patient: "",
    created_at: "",
    clinic: { name: "" },
    doctor: { name: "" },
    note: "",
    medicine: "",
  });

  const getMedicalHistory = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get(
          `http://127.0.0.1:3333/doctor/medicalhistory/${id}`,

          {
            headers: {
              "Content-Type": "application/json", // Adjust the content type based on your API requirements
              Authorization: `Bearer ${at}`,
            },
          }
        )
        .then((response) => {
          setContent(response.data.data);
        });

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id > 0) {
      getMedicalHistory();
    }
  }, [id]);

  return (
    <>
      <input type="checkbox" id="getMedicalHistory" className="modal-toggle" />
      <div className="modal  ">
        <div className="modal-box h-5/6 flex flex-col items-center ">
          <label
            htmlFor="getMedicalHistory"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
          <span className="text-lg font-bold mb-8 tracking-wider flex flex-row gap-2 capitalize">
            {content.patient ? content.patient : ""}
          </span>

          <div className="w-full flex flex-col mb-4 pl-4 justify-evenly">
            <table className="w-11/12 text-sm">
              <thead className="hidden">
                <tr className="h-10 hidden">
                  <th className="w-1/3 px-1 ">Nama Klinik</th>
                  <th className="w-1/12 ">:</th>
                  <th className="w-1/2 capitalize">Kimia Farma</th>
                </tr>
              </thead>
              <tbody className="w-full align-top">
                <tr className="h-11  align-top" >
                  <td className="w-1/3 px-1 ">Pada </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">
                    {content.created_at ? content.created_at.split("T")[0] : ""}{" "}
                  </td>
                </tr>
                <tr className="h-11  align-top">
                  <td className="w-1/3 px-1 ">KLinik </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">
                    {content.clinic.name ? content.clinic.name : ""}
                  </td>
                </tr>
                <tr className="h-11  align-top">
                  <td className="w-1/3 px-1 ">Dokter </td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">
                    {content.doctor.name ? content.doctor.name : ""}
                  </td>
                </tr>
                <tr className="h-[130px] py-3">
                  <td className="w-1/3 px-1 align-top ">Catatan </td>
                  <td className="w-1/12 align-top ">:</td>
                  <td className="w-1/2 text-sm  align-top ">
                    {content.note ? content.note : ""}
                  </td>
                </tr>
                <tr className="h-[130px] w-full py-2">
                  <td className="w-1/3 px-1 align-top ">Obat </td>
                  <td className="w-1/12 align-top ">:</td>
                  <td className="w-1/2 text-sm align-top  ">
                    {content.medicine ? content.medicine : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="getMedicalHistory">
          Close
        </label>
      </div>
    </>
  );
};

export default MedicalHistory;
