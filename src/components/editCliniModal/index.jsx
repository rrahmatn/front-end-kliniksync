import React, { useEffect, useState } from "react";
import axios from "axios";

const EditClinicModal = ({ id }) => {
  const [clinic, setClinic] = useState({});
  const [payment, setPayment] = useState(0);
  const [error, setError] = useState(false);
  const [editedValues, setEditedValues] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    type: "",
    expired_at: "",
    address: "",
  });

  const getClinic = async () => {
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;
    try {
      const response = await axios.get(
        `http://127.0.0.1:3333/superadmin/clinic/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );
      const clinicData = response.data.data;
      setPayment(clinicData.paymentCount);
      setClinic(clinicData.clinic);

      // Format tanggal dari API
      const formattedDate = new Date(clinicData.clinic.expired_at)
        .toISOString()
        .split("T")[0];

      setEditedValues({
        name: clinicData.clinic.name,
        owner: clinicData.clinic.owner,
        email: clinicData.clinic.email,
        phone: clinicData.clinic.phone,
        type: clinicData.clinic.type,
        expired_at: formattedDate,
        address: clinicData.clinic.address,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id > 0) {
      getClinic();
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }, [error]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const access_Token = localStorage.getItem("accessToken");
    const at = access_Token;

    // Mengubah format tanggal menjadi yyyy-mm-dd
    const formattedDate = new Date(editedValues.expired_at)
      .toISOString()
      .split("T")[0];
    setEditedValues((prevValues) => ({
      ...prevValues,
      expired_at: formattedDate,
    }));

    try {
      const response = await axios.patch(
        `http://127.0.0.1:3333/superadmin/clinic/${id}`,
        editedValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${at}`,
          },
        }
      );
      document.getElementById("my_modal_4").close();
    } catch (err) {
      setError(true);
    }
  };

  return (
    <>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 h-fit pb-0 max-w-5xl flex gap-0 flex-col">
          <span className="w-full h-11 pl-4  text-xl flex flex-row justify-between">
            {clinic.name} <p className="w-1/4 pr-5">Tagihan</p>
          </span>
          <span className="w-full h-11  pl-4 border-b-2 shadow-sm rounded-md text-md  flex flex-row justify-between">
            {clinic.address}
            <p className="w-1/4 pl-1">Rp. {payment * 20000}</p>
          </span>
          <div className="w-full h-full flex flex-col justify-between pt-5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3  h-full list-none"
            >
              <div className="w-full h-fit flex flex-row px-4">
                <div className="w-1/2 flex flex-col gap-3 items-end">
                  <li className="w-full flex flex-col  pr-4 ">
                    <label htmlFor="ininamaklinik" name="name">
                      Nama Klnik :
                    </label>
                    <input
                      type="text"
                      id="ininamaklinik"
                      name="name"
                      onChange={handleInputChange}
                      value={editedValues.name}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="owner" name="owner">
                      Pemilik :
                    </label>
                    <input
                      type="text"
                      id="owner"
                      name="owner"
                      onChange={handleInputChange}
                      value={editedValues.owner}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="iniemailclinic" name="email">
                      email :
                    </label>
                    <input
                      type="text"
                      id="iniemailclinic"
                      name="email"
                      onChange={handleInputChange}
                      value={editedValues.email}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="phone" name="phone">
                      No. Telp :
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={handleInputChange}
                      value={editedValues.phone}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                  <li className="w-full flex flex-col pr-4">
                    <label htmlFor="type" name="type">
                      Type:
                    </label>
                    <select
                      id="type"
                      name="type"
                      onChange={handleInputChange}
                      value={editedValues.type}
                      className="w-full h-8 ring-1 mt-2 px-3 pr-5 rounded-md shadow-md"
                      required
                    >
                      <option value="premium">Premium</option>
                      <option value="regular">Regular</option>
                    </select>
                  </li>
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="expired_at" name="expired_at">
                      Kadaluarsa pada :
                    </label>
                    <input
                      type="date"
                      id="expired_at"
                      name="expired_at"
                      onChange={handleInputChange}
                      value={editedValues.expired_at}
                      className="w-full h-8 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                  <li className="w-full flex flex-col pr-4 ">
                    <label htmlFor="address" name="address">
                      Alamat
                    </label>
                    <textarea
                      type="text"
                      id="address"
                      name="address"
                      onChange={handleInputChange}
                      value={editedValues.address}
                      className="w-full h-28 p-2 ring-1 mt-2 px-3 rounded-md shadow-md"
                      required
                    />
                  </li>
                </div>
              </div>
              <div className="modal-action flex flex-row justify-end items-center p-3 pr-2">
                <button type="submit" className="btn btn-sm shadow-lg font-medium bg-[#8AD1F2] text-[#FFFFFF] hover:bg-[#00A6ED]">
                  Simpan
                </button>
                <button
                  type="button"
                  className="btn bg-[#FFFFFF] text-[#E64D4D] border-[#E64D4D] hover:bg-[#E64D4D] hover:text-[#FFFFFF] font-medium shadow-lg  btn-sm "
                  onClick={() => document.getElementById("my_modal_4").close()}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
       
      </dialog>
    </>
  );
};

export default EditClinicModal;
