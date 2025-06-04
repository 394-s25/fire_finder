import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
} from "@mui/material";

export default function AdminAccess({ requests, approveRequest }) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #F0F0F0",
        mt: 4,
      }}
    >
      {/* Card Header */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#666666" }}>
          Admin Access Requests
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#E0E0E0" }} />

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#A0A0C0", fontWeight: 600 }}>
              Email ⌄
            </TableCell>
            <TableCell sx={{ color: "#A0A0C0", fontWeight: 600 }}>
              Date ⌄
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No admin requests
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell sx={{ color: "#1B1B4D", fontWeight: 600 }}>
                  {req.email}
                </TableCell>
                <TableCell sx={{ color: "#1B1B4D", fontWeight: 600 }}>
                  {req.timestamp
                    ?.toDate()
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, ".")}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => alert("Reject logic here")}
                    sx={{
                      borderRadius: "999px",
                      color: "#F44336",
                      borderColor: "#F44336",
                      textTransform: "none",
                      fontWeight: 500,
                      mr: 1,
                      px: 2,
                    }}
                  >
                    Reject Access
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => approveRequest(req)}
                    sx={{
                      borderRadius: "999px",
                      color: "#F44336",
                      borderColor: "#F44336",
                      textTransform: "none",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    Approve Access
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
