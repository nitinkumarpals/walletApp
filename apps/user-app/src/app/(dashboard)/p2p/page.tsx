import React from "react";
import { SendCard } from "../../../components/SendCard";

const page = () => {
  return (
    <div className="w-full">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
      </div>
      <SendCard />
    </div>
  );
};

export default page;
