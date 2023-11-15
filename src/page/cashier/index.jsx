import Navbar from "../../components/navbar";
import UserModal from "../../components/userModal.";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

const Cashier = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies(["role"]);

  useEffect(() => {
    if (cookie.role !== "cashier") {
      navigate(`/${cookie.role}`);
    }
  }, []);
  return (
    <>
      <div className="w-full h-fit flex flex-col">halo ini halaman Cashier</div>
      <Navbar />
      <UserModal />
    </>
  );
};

export default Cashier;
