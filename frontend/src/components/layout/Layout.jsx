import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box maxW={{ base: "full", md: "8xl" }} minH={"100vh"} m={"auto"}>
      <Outlet />
    </Box>
  );
};

export default Layout;
