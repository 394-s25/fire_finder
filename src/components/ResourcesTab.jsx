import { Grid, Typography } from "@mui/material";

export default function ResourcesTab({
  title,
  data,
  CardComponent,
  extraProps = {},
}) {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        {data.map((item) => (
          <Grid
            key={item.id}
            columnSpacing={2}
            sx={{ gridColumn: { xs: "span 4", sm: "span 4", md: "span 4" } }}
          >
            <CardComponent data={item} {...extraProps} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
