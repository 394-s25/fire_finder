import {
  Avatar,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useAuthContext } from "../services/userProvider";

export default function ContactCard({ data, onDelete }) {
  const { user } = useAuthContext();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "white",
        border: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: 2,
      }}
    >
      <Avatar
        alt={data.name}
        src={data.image || ""}
        sx={{ width: 64, height: 64, mb: 2 }}
      />
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.role || "Outreach Coordinator"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {data.email}
        </Typography>
        <Typography variant="body2">{data.phone}</Typography>
      </CardContent>

      <Box mt={2} display="flex" gap={1}>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#F26B3A" }}
          href={`mailto:${data.email}`}
        >
          Contact
        </Button>
        {user?.isAdmin && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onDelete?.(data.id)}
          >
            Delete
          </Button>
        )}
      </Box>
    </Card>
  );
}
