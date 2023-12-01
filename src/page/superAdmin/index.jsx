import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import Navbar from "../../components/navbar";
import logo from "../../assets/Logo.svg";
import { BiSolidDashboard } from "react-icons/bi";
import { AiFillFileAdd } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import AddClinic from "../../components/superAdmin/addClinic";
import ShowClinic from "../../components/superAdmin/showClinic";
import Logout from "../../components/logout";
import UserModal from "../../components/userModal.";
import { RiAdminFill } from "react-icons/ri";
import AddSuperAdmin from "../../components/superAdmin/addSuperAdmin";

const SuperAdmin = () => {
  const [page, setPage] = useState("showClinic");
  const navigate = useNavigate();
  const [cookie] = useCookies(["role"]);
  useEffect(() => {
    if(!cookie.role || cookie.role === undefined){
      navigate(`/auth`);
    }else{
      if (cookie.role !== "superadmin") {
        navigate(`/${cookie.role}`);
      }
    }
  }, []);


  const thisPage = () => {
    if (page === "showClinic") {
      return <ShowClinic />;
    } else if (page === "addClinic") {
      return <AddClinic />;
    }else if(page === "addSuperAdmin"){
      return <AddSuperAdmin/>
    }
  };
  return (
    <>
      <div className="w-full h-screen overflow-hidden flex text flex-row">
        <aside className="w-1/6 h-full z-20 bg-2 flex flex-col">
          <figure className="w-full h-28 -mt-5  flex items-center justify-center">
            <img src={logo} alt="kliniksync" className="w-2/3 h-fit" />
          </figure>
          <ul className="w-full h-fit flex flex-col mt-5  list-none">
            <li
              className={`w-full gap-2   px-4 py-4 flex flex-row items-center hover:bg-violet-500 hover:text-white cursor-pointer ${
                page === "showClinic" ? "bg-violet-800 text-white" : ""
              }`}
              onClick={() => setPage("showClinic")}
            >
              <BiSolidDashboard className="text-xl" />
              <button className="w-full h-full text-sm text-left">Dashboard</button>
            </li>
            <li
              className={`w-full gap-2  px-4 py-4 flex flex-row items-center cursor-pointer hover:bg-violet-500 hover:text-white ${
                page === "addClinic" ? "bg-violet-800 text-white" : ""
              }`}
              onClick={() => setPage("addClinic")}
            >
              <AiFillFileAdd className="text-xl" />
              <button className="w-full h-full text-sm text-left">Tambah Klinik</button>
            </li>
            <li
              className={`w-full gap-2  px-4 py-4 flex flex-row items-center cursor-pointer hover:bg-violet-500 hover:text-white ${
                page === "addSuperAdmin" ? "bg-violet-800 text-white" : ""
              }`}
              onClick={() => setPage("addSuperAdmin")}
            >
              <RiAdminFill  className="text-xl" />
              <button className="w-full text-sm h-full text-left">Tambah Super Admin</button>
            </li>
            <li
              className="w-full gap-2  px-4 py-4 flex flex-row items-center hover:bg-violet-500 hover:text-white cursor-pointer "
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              <IoLogOutOutline className="text-xl" />
              <button className="w-full h-full text-sm text-left "> Logout</button>
            </li>
          </ul>
        </aside>
        <div className="w-5/6 h-full pt-16 xl:pt-20 2xl:pt-28 flex flex-col">
          {thisPage()}
        </div>
      </div>
      <Navbar />
      <Logout />
      <UserModal />
    </>
  );
};

export default SuperAdmin;
