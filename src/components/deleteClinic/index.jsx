import axios from "axios";
import React, { useEffect, useState } from "react";

const DeleteClinic = ({ id, name , url ,modal }) => {
  const [toast, setToast] = useState(false);

  const deleteClinic = async () => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;

      const response = await axios.patch(
        `http://127.0.0.1:3333/${url}/${id}`,
        {
          id,
        },
        {
          headers: {
            "Content-Type": "application/json", // Adjust the content type based on your API requirements
            Authorization: `Bearer ${at}`,
          },
        }
      );
      setTimeout(() => {
        document.getElementById("delete_clinic").close();
      }, 2000);
     
      setToast(true);
      return response.data;
    } catch (error) {
      console.log(error);
      setToast(false);
    }
  };
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
  }, [toast]);

  return (
    <>
      <dialog id="delete_clinic" className="modal">
        <div className="modal-box p-4">
          <h3 className="font-medium text-lg">
            Klik lanjutkan untuk menghapus {name}{" "}
          </h3>
          <div className="w-full flex flex-row gap-3 mt-3 justify-end -mb-2">
            <button
              className="btn btn-sm font-medium bg-warning"
              onClick={() => {
                document.getElementById("delete_clinic").close();
              }}
            >
              Batal
            </button>
            <button
              className="btn btn-sm font-medium btn-error"
              onClick={deleteClinic}
            >
              {" "}
              Lanjutkan
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>batal</button>
        </form>
        {toast ? (
          <div className="toast z-[9999999] fixed toast-top toast-center">
            <div className="alert alert-success">
              <span>Berhasil menghapus {name}</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </dialog>
    </>
  );
};

export default DeleteClinic;
