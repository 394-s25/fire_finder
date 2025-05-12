import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import placeholderImg from "../imgs/placeholder.jpeg";

const EventCard = ({ title, date, description }) => {
  return (
    <Card className="mb-6 rounded-lg overflow-hidden">
      <CardActionArea sx={{ display: "flex", alignItems: "flex-start" }}>
        {/* Left-aligned image */}
        <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
          <img
            src={placeholderImg}
            alt="Event placeholder"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right content area with no padding */}
        <div
          style={{
            marginLeft: "0.75rem", // gap between image and text
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "left",
          }}
        >
          {/* Title and date */}
          <div style={{ marginBottom: "0.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500 }}>{title}</h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              {date}
            </p>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "0.875rem",
              color: "#4b5563",
              marginBottom: "0.75rem",
            }}
          >
            {description}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#f97316",
                    "&.Mui-checked": { color: "#f97316" },
                    padding: "4px",
                  }}
                />
              }
              label="RSVP"
              sx={{
                border: "1px solid #f97316",
                borderRadius: "0.25rem",
                padding: "0 8px",
                margin: 0,
                color: "#f97316",
                "&:hover": { backgroundColor: "rgba(249, 115, 22, 0.05)" },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#f97316",
                    "&.Mui-checked": { color: "#f97316" },
                    padding: "4px",
                  }}
                />
              }
              label="Save"
              sx={{
                border: "1px solid #f97316",
                borderRadius: "0.25rem",
                padding: "0 8px",
                margin: 0,
                color: "#f97316",
                "&:hover": { backgroundColor: "rgba(249, 115, 22, 0.05)" },
              }}
            />
          </div>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
