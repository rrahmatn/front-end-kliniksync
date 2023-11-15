import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbLayoutBottombarCollapseFilled } from "react-icons/tb";
import ChangePass from "../ChangePass";
import ClearPaymentModal from "../clearPaymentModal";
import { IoMdRefreshCircle } from "react-icons/io";
import DeletClinic from "../deleteClinic";

const DetailModal = ({ id }) => {
  const [clinic, setClinic] = useState([]);

  const [payment, setPayment] = useState(0);

  const getClinic = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios
        .get(
          `http://127.0.0.1:3333/superadmin/clinic/${id}`,

          {
            headers: {
              "Content-Type": "application/json", // Adjust the content type based on your API requirements
              Authorization: `Bearer ${at}`,
            },
          }
        )
        .then((response) => {
          setPayment(response.data.data.paymentCount);
          setClinic(response.data.data.clinic);
        });

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const refresh = async () => {
    await getClinic();

    return false;
  };

  useEffect(() => {
    if (id > 0) {
      getClinic();
    }
  }, [id]);

  return (
    <>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal  ">
        <div className="modal-box h-2/3 flex flex-col items-center ">
          <label
            htmlFor="my_modal_7"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
          <span className="text-lg font-bold mb-4 tracking-wider flex flex-row gap-2">
            Informasi Klinik
            <button onClick={refresh} className="mx-3 flex h-full w-fit p-1 items-center">
              <IoMdRefreshCircle  className="text-2xl"/>
            </button>
          </span>
          <div className="w-full flex items-center mt-1 pl-4 justify-evenly">
            <table className="w-11/12">
              <thead>
                <tr className="h-10 hidden">
                  <th className="w-1/3 px-1 ">Nama Klinik</th>
                  <th className="w-1/12 ">:</th>
                  <th className="w-1/2 capitalize">Kimia Farma</th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-10">
                  <td className="w-1/3 px-1 ">Nama Klinik</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{clinic.name}</td>
                </tr>
                <tr className="h-10">
                  <td className="w-1/3 px-1 ">Nama Pemilik</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{clinic.owner}</td>
                </tr>
                <tr className="h-10">
                  <td className="w-1/3 px-1 ">Alamat</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{clinic.address}</td>
                </tr>
                <tr className="h-10">
                  <td className="w-1/3 px-1 "> Email</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2">{clinic.email}</td>
                </tr>
                <tr className="h-10">
                  <td className="w-1/3 px-1 "> No. Telp</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2">{clinic.phone}</td>
                </tr>
                <tr className="h-10">
                  <td className="w-1/3 px-1 "> Type</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2 capitalize">{clinic.type}</td>
                </tr>
                <tr className="h-10">
                  <td className="w-1/3 px-1 "> Tagihan</td>
                  <td className="w-1/12 ">:</td>
                  <td className="w-1/2">{`${payment * 2000}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="w-full mt-auto flex flex-row justify-end gap-1  ">
            <button
              type="button"
              className="btn text-sm font-medium btn-sm  btn-error cursor-pointer shadow-lg"
              onClick={() =>
                document.getElementById("delete_clinic").showModal()
              }
            >
              Hapus
            </button>
            <button
              type="button"
              className={`btn text-sm font-medium btn-sm ${
                payment !== 0 ? "btn-primary" : "btn-disabled"
              }    cursor-pointer shadow-lg`}
              onClick={() => {
                if (payment !== 0)
                  document.getElementById("clear_payment").showModal();
              }}
            >
              Bersihkan Tagihan
            </button>
            <button
              type="button"
              className="btn text-sm font-medium btn-sm btn-warning cursor-pointer shadow-lg"
              onClick={() =>
                document.getElementById("change_password").showModal()
              }
            >
              Ganti Password
            </button>
            <button
              type="button"
              className="btn text-sm font-medium btn-sm  bg cursor-pointer shadow-lg"
              onClick={() => document.getElementById("my_modal_4").showModal()}
            >
              Edit
            </button>
          </span>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
      <ChangePass url={'superadmin/clinic/changepassword'} id={id} />
      <ClearPaymentModal id={id} name={clinic.name} />
      <DeletClinic id={id} url={`superadmin/clinic/delete`} name={clinic.name} modal={"my_modal_7"}/>

    </>
  );
};

export default DetailModal;
