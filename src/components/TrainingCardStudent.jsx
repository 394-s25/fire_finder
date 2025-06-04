import {
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

export default function TrainingCardStudent({ data }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "white",
        border: "1px solid #ddd",
      }}
    >
      <Box sx={{ px: 2, pt: 1 }}>
        <Chip
          label={data.topic || "Training Topic"}
          sx={{
            backgroundColor: "#B55050",
            color: "white",
            fontSize: "0.75rem",
          }}
          size="small"
        />
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {data.title || "Training Title"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {data.instructor || "Instructor or Institution"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Duration: {data.duration || "TBD"}
        </Typography>
        <Typography variant="body2">
          {data.description || "Short description of the training resource."}
        </Typography>
      </CardContent>
      <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#F26B3A" }}
        >
          Access
        </Button>
      </Box>
    </Card>
  );
}
