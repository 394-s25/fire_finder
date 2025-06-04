import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getGoogleCalendarUrl } from "../services/googleCalendar";
import { useAuthContext } from "../services/userProvider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@mui/material";
import { db } from "../services/firestoreConfig";
import EventDetails from "./EventDetails";
import banner from "../imgs/logo.png"; // Default banner image

const EventCardStudent = ({
  type,
  id,
  title,
  description,
  image,
  location,
  startDate,
  endDate,
}) => {
  const { user } = useAuthContext();
  const [isSaved, setIsSaved] = useState(false);
  const [isRSVPd, setIsRSVPd] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  
  const studentRef = doc(db, "students", user.uid);
  const eventRef = doc(db, "events", id);

  // Check if event is in the future
  const isFutureEvent = startDate && startDate > new Date();

  // Determine if checkboxes should be shown
  const showCheckboxes = (type === "allevents" || type === "rsvpd" || type === "saved");

  // Fetch student and event data to set RSVP and saved states
  useEffect(() => {
    const fetchState = async () => {
      if (!user) {
        setIsRSVPd(false);
        setIsSaved(false);
        return;
      }

      const studentSnap = await getDoc(studentRef);
      const studentData = studentSnap.data() || {};

      const studentRsvp = studentData.rsvp || [];
      const studentSaved = studentData.saved || [];

      setIsRSVPd(studentRsvp.some((ref) => ref.path === eventRef.path));
      setIsSaved(studentSaved.some((ref) => ref.path === eventRef.path));
    };
    fetchState();
  }, [user, studentRef, eventRef]);

  // Toggle save checkbox
  const toggleSave = async (e) => {
    e.stopPropagation(); // Prevent click from opening modal
    if (!user) return;

    const studentSnap = await getDoc(studentRef);
    const eventSnap = await getDoc(eventRef);

    const studentData = studentSnap.data() || {};
    const eventData = eventSnap.data() || {};

    const studentSaved = studentData.saved || [];
    const eventSavedStudents = eventData.saved || [];

    const isCurrentlySaved = studentSaved.some(
      (ref) => ref.path === eventRef.path
    );

    if (isCurrentlySaved) {
      // Remove from student's saved and event's saved
      await updateDoc(studentRef, {
        saved: studentSaved.filter((ref) => ref.path !== eventRef.path),
      });
      await updateDoc(eventRef, {
        saved: eventSavedStudents.filter((ref) => ref.path !== studentRef.path),
      });
      setIsSaved(false);
    } else {
      // Add to student's saved and event's saved
      await updateDoc(studentRef, {
        saved: [...studentSaved, eventRef],
      });
      await updateDoc(eventRef, {
        saved: [...eventSavedStudents, studentRef],
      });
      setIsSaved(true);
    }
  };

  // Toggle RSVP checkbox
  const toggleRSVP = async (e) => {
    e.stopPropagation(); // Prevent click from opening modal
    if (!user) return;

    const studentSnap = await getDoc(studentRef);
    const eventSnap = await getDoc(eventRef);

    const studentData = studentSnap.data() || {};
    const eventData = eventSnap.data() || {};

    const studentRsvp = studentData.rsvp || [];
    const eventRsvpStudents = eventData.rsvp || [];

    const isCurrentlyRSVPd = studentRsvp.some(
      (ref) => ref.path === eventRef.path
    );

    if (isCurrentlyRSVPd) {
      // Remove from student's rsvp and event's rsvp
      await updateDoc(studentRef, {
        rsvp: studentRsvp.filter((ref) => ref.path !== eventRef.path),
      });
      await updateDoc(eventRef, {
        rsvp: eventRsvpStudents.filter((ref) => ref.path !== studentRef.path),
      });
      setIsRSVPd(false);
    } else {
      // Add to student's rsvp and event's rsvp
      await updateDoc(studentRef, {
        rsvp: [...studentRsvp, eventRef],
      });
      await updateDoc(eventRef, {
        rsvp: [...eventRsvpStudents, studentRef],
      });
      setIsRSVPd(true);
    }
  };

  const openEvent = () => {
    setIsEventOpen(true);
  };

  const closeEvent = () => {
    setIsEventOpen(false);
  };

  if (!image) {
    image = banner;
  }

  return (
    <>
      <Card className="mb-6 rounded-lg overflow-hidden">
        <CardActionArea sx={{ display: "flex", alignItems: "flex-start" }} onClick={openEvent}>
          <div
            style={{
              width: "16.5rem",
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
          <div
            style={{
              marginLeft: "0.75rem",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              padding: "1rem",
            }}
          >
            <div style={{ marginBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 500 }}>{title}</h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginTop: "-0.5rem",
                }}
              >
                {startDate?.toLocaleDateString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {endDate?.toLocaleDateString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#4b5563",
                marginBottom: "0.75rem",
                marginTop: "-0.5rem",
              }}
            >
              {location}
            </div>
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
            <div style={{ flexGrow: 5 }} />
            {showCheckboxes && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "0.5rem",
                  paddingRight: "0.5rem",
                  paddingLeft: "0.5rem",
                }}
              >
                {isFutureEvent && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isRSVPd}
                        onChange={(e) => toggleRSVP(e)}
                        onClick={(e) => e.stopPropagation()} // Stop click propagation
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
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSaved}
                      onChange={(e) => toggleSave(e)}
                      onClick={(e) => e.stopPropagation()} // Stop click propagation
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
                {isRSVPd && (
                  <a
                    href={getGoogleCalendarUrl({
                      title,
                      description,
                      startDate,
                      endDate,
                      location,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: "#f97316", color: "#f97316" }}
                    >
                      Add to Calendar
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </CardActionArea>
      </Card>
      <EventDetails
        open={isEventOpen}
        onClose={closeEvent}
        title={title}
        description={description}
        image={image}
        location={location}
        startDate={startDate}
        endDate={endDate}
        isSaved={isSaved}
        isRSVPd={isRSVPd}
        toggleSave={toggleSave}
        toggleRSVP={toggleRSVP}
        getGoogleCalendarUrl={getGoogleCalendarUrl}
      />
    </>
  );
};

export default EventCardStudent;