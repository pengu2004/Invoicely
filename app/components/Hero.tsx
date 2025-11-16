"use client";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import CountUp from "./CountUp";
import TextType from "./TextType";
import SplitText from "./SplitText";
export default function Hero() {
  const router = useRouter();

  const handleCreateInvoice = () => {
    router.push("/create-invoice");
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mt-20 text-black">
          Streamlined Invoicing for Freelancers
        </h1>
        <TextType
          className="text-2xl  text-black mt-20"
          text={["Simplify your payments"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          variableSpeed={false}
          onSentenceComplete={() => {}}
        />
        <div className="flex flex-col items-center mt-10">
          <CountUp
            className="text-5xl font-bold text-black text-center"
            to={1000}
            onStart={() => {}}
            onEnd={() => {}}
          />
          <h2>Invoice Processed</h2>
        </div>
      </div>
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
