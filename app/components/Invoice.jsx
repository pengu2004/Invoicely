import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";

export default function Invoice() {
  const invoiceData = {
    invoiceNumber: "INV-2024-001",
    invoiceDate: "July 24, 2024",
    dueDate: "2024-07-31",
    from: {
      companyName: "Your Company Name",
      address: "123 Business Rd",
      cityStateZip: "Suite 100, Anytown, CA 90210",
      email: "info@yourcompany.com",
    },
    billTo: {
      companyName: "Client Company Inc.",
      address: "456 Client St",
      cityStateZip: "Client City, NY 10001",
      email: "client@example.com",
    },
    items: [
      { description: "Service Fee", qty: 1, unitPrice: 500.0, total: 500.0 },
      {
        description: "Consulting Hours",
        qty: 2,
        unitPrice: 100.0,
        total: 200.0,
      },
    ],
    totalDue: 1080.0,
    paymentTerms: "Payment is due within 30 days.",
    notes: "Made with 💚 Tejus",
  };

  return (
    <Paper
      sx={{
        p: 4,
        mx: "auto",
        my: 4,
        maxWidth: 800,
        minHeight: "70vh",
        boxShadow: 3,
      }}
    >
      {/* Invoice Header */}
      <Grid
        container
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <Grid item sx={{ display: "flex", alignItems: "center" }}>
          {/* Small Flower Illustration */}
          {/* You can replace this with an actual SVG icon or image component */}
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#888" }} // Subtle grey color for the flower
            >
              <path d="M12 2a5 5 0 0 0-5 5c0 4.2 7 13 7 13s7-8.8 7-13a5 5 0 0 0-5-5z" />
              <circle cx="12" cy="7" r="2" />
            </svg>
          </Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: "'Great Vibes', cursive", // Apply cursive font here
              fontWeight: 400, // Cursive fonts often look best with normal weight
              fontSize: "2.8rem", // Slightly larger for impact
              color: "#333",
            }}
          >
            Invoice
          </Typography>
        </Grid>
        <Grid item textAlign="right">
          <Typography variant="body2" color="text.secondary">
            Invoice #{invoiceData.invoiceNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {invoiceData.invoiceDate}
          </Typography>
        </Grid>
      </Grid>

      {/* From and Bill To Details */}
      <Grid container spacing={4} mb={4} pb={2} borderBottom="1px solid #eee">
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" fontWeight={600}>
            {invoiceData.from.companyName}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Due: {invoiceData.dueDate}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            From:
          </Typography>
          <Typography variant="body2">
            {invoiceData.from.companyName}
          </Typography>
          <Typography variant="body2">{invoiceData.from.address}</Typography>
          <Typography variant="body2">
            {invoiceData.from.cityStateZip}
          </Typography>
          <Typography variant="body2">{invoiceData.from.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} textAlign={{ xs: "left", sm: "right" }}>
          <Typography variant="body2" fontWeight={500}>
            Bill To:
          </Typography>
          <Typography variant="body2">
            {invoiceData.billTo.companyName}
          </Typography>
          <Typography variant="body2">{invoiceData.billTo.address}</Typography>
          <Typography variant="body2">
            {invoiceData.billTo.cityStateZip}
          </Typography>
          <Typography variant="body2">{invoiceData.billTo.email}</Typography>
        </Grid>
      </Grid>

      {/* Invoice Items Table */}
      <Table sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>
              Description
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 500, color: "text.secondary" }}
            >
              Qty
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 500, color: "text.secondary" }}
            >
              Unit Price
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 500, color: "text.secondary" }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoiceData.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell align="right">{item.qty}</TableCell>
              <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
              <TableCell align="right">${item.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Total Due and Payment Terms */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="body2" color="text.secondary" mb={2}>
          {invoiceData.paymentTerms}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: { xs: "100%", sm: "50%", md: "40%" },
            pt: 2,
            borderTop: "2px solid #333",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Total Due:
          </Typography>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            ${invoiceData.totalDue.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Notes Section (Optional) */}
      <Divider sx={{ mt: 4, mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Notes: {invoiceData.notes}
      </Typography>
    </Paper>
  );
}
