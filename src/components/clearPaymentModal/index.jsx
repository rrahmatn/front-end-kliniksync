import axios from "axios";
import React, { useEffect, useState } from "react";

const ClearPaymentModal = ({ id, name }) => {
  const [toast, setToast] = useState(false);

  const ClearPayment = async () => {
    try {
      const access_Token = localStorage.getItem("accessToken");
      const at = access_Token;

      const response = await axios.patch(
        `http://127.0.0.1:3333/superadmin/clinic/payment/${id}`,
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
        document.getElementById("clear_payment").close();
      }, 3000);
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
      }, 3000);
    }
  }, [toast]);

  return (
    <>
      <dialog id="clear_payment" className="modal">
        <div className="modal-box p-4">
          <h3 className="font-medium text-lg">
            Klik lanjutkan untuk membersihkan tagihan untuk {name}{" "}
          </h3>
          <div className="w-full flex flex-row gap-3 mt-3 justify-end -mb-2">
            <button
              className="btn btn-sm font-medium bg-warning"
              onClick={() => {
                document.getElementById("clear_payment").close();
              }}
            >
              Batal
            </button>
            <button
              className="btn btn-sm font-medium btn-info"
              onClick={ClearPayment}
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
              <span>Berhasil membersihkan tagihan untuk {name}</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </dialog>
    </>
  );
};

export default ClearPaymentModal;
