import Button from "@mui/material/Button";
export default function Hero() {
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
