import UserModal from "../../components/userModal.";
import Navbar from "../../components/navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

const Pharmacy = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies(["role"]);

  useEffect(() => {
    if (cookie.role !== "pharmacy") {
      navigate(`/${cookie.role}`);
    }
  }, []);
  return (
    <>
      <div className="w-full h-fit flex flex-col">
        halo ini halaman Pharmacy
      </div>
      <Navbar />
      <UserModal />
    </>
  );
};

export default Pharmacy;
