import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

export default function ClassCard({ data }) {
  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <Box sx={{ px: 2, pt: 1 }}>
        <Chip
          label={data.trade || "Trade Name"}
          color="secondary"
          size="small"
        />
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Class Name
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.instructor || "Professor/Institution name"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Duration: 6 weeks
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Class Description: Short description of class content
          <br />
          Location: {data.location}
          <br />
          Start/End: {data.start} - {data.end}
          <br />
        </Typography>
      </CardContent>
      <Box display="flex" justifyContent="space-between" px={2} pb={2}>
        <Button size="small" variant="outlined">
          Learn More
        </Button>
        <Button size="small" variant="contained" color="warning">
          Enroll
        </Button>
      </Box>
    </Card>
  );
}
