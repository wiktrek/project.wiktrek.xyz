import type { NextPage } from "next";
import { UserButton } from "@clerk/nextjs";
import React from "react";const Home: NextPage = () => {

  return (
<UserButton afterSignOutUrl="/"/>
  )}
  export default Home;