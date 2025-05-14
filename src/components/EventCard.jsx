import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import placeholderImg from "../imgs/placeholder.jpeg";

const EventCard = ({ title, date, description, image }) => {
  return (
    <Card className="mb-6 rounded-lg overflow-hidden">
      <CardActionArea sx={{ display: "flex", alignItems: "flex-start" }}>
        {/* Left-aligned image */}
        <div
          style={{
            width: "15rem",
            height: "15rem",
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: "0.375rem",
          }}
        >
          <img
            src={image}
            alt={`${title} image`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              display: "block",
            }}
          />
        </div>

        {/* Right content area with no padding */}
        <div
          style={{
            marginLeft: "0.75rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
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
                marginTop: "-0.5rem",
              }}
            >
              {date}
            </p>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "0.875rem",
              color: "#4b5563",
              marginBottom: "0.75rem",
              marginTop: "-0.5rem",
            }}
          >
            {description.split("\n").map((line, index) => (
              <p key={index} style={{ margin: 0 }}>
                {line}
              </p>
            ))}
          </div>

          {/* Spacer to push buttons to bottom */}
          <div style={{ flexGrow: 5 }} />

          {/* Buttons row pinned to bottom */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "0.5rem",
              paddingRight: "0.5rem",
              paddingLeft: "0.5rem",
            }}
          >
            {/* RSVP Button */}
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
                "&:hover": {
                  backgroundColor: "rgba(249, 115, 22, 0.05)",
                },
              }}
            />

            {/* Save Button */}
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
                "&:hover": {
                  backgroundColor: "rgba(249, 115, 22, 0.05)",
                },
              }}
            />
          </div>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
