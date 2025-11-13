"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IBM_Plex_Mono } from "next/font/google";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleCreateInvoice = () => {
    router.push("/create-invoice");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          mx: "auto",
          mt: 2,
          bgcolor: "white",

          width: "80%",
          borderRadius: 8,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            fontFamily={"IBM_Plex_Mono"}
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontSize: 24,
              color: "black",
              position: "absolute",
              left: "50%",
              fontFamily: "IBM Plex Mono",
              transform: " translateX(-50%)",
            }}
          >
            Invoicely{" "}
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
