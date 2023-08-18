import { SignIn } from "@clerk/nextjs/app-beta";
import React from "react";

const page = () => {
  return (
    <div>
      <SignIn />
    </div>
  );
};

export default page;
