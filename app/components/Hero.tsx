"use client";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleCreateInvoice = () => {
    router.push("/create-invoice");
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-20 text-black">
        Streamlined Invoicing for Freelancers
      </h1>
      <h3 className="text-2xl  text-center mt-20 text-black">
        Simplify your payments
      </h3>
      <Button
        variant="contained"
        onClick={handleCreateInvoice}
        sx={{
          display: "block",
          mx: "auto",
          color: "white",
          bgcolor: "black",
          mt: 4,
          borderRadius: 2,
        }}
      >
        Create your first invoice
      </Button>
    </>
  );
}
