import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { getUser, useAccessToken } from "../../state";

const Logout = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useAccessToken();
  const [user, setUser] = getUser();
  const [cookies, setCookies, removeCookies] = useCookies([
    "refresh_token",
    "role",
    "name",
  ]);
  const logout = async () => {
    setAccessToken("");
    setUser({
      name: "",
      email: "",
    });
    removeCookies("refresh_token");
    removeCookies("role");
    removeCookies("name");
    navigate("/auth");
  };
  return (
    <>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box p-4">
          <h3 className="font-medium text-lg">Anda yakin ingin keluar?</h3>
          <div className="w-full flex flex-row gap-3 mt-3 justify-end -mb-2">
            <button
              className="btn btn-sm font-medium bg-warning"
              onClick={() => {
                document.getElementById("my_modal_2").close();
              }}
            >
              {" "}
              Batal
            </button>
            <button className="btn btn-sm font-medium bg-red-500" onClick={logout}> 
              {" "}
              Keluar
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

export default Logout;
