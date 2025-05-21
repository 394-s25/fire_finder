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

const EventCard = ({
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

  const studentRef = doc(db, "students", user.uid);
  const eventRef = doc(db, "events", id);

  useEffect(() => {
    const fetchState = async () => {
      if (!user) return;

      const studentSnap = await getDoc(studentRef);
      const eventSnap = await getDoc(eventRef);

      const studentEvents = studentSnap.data()?.events || [];
      const rsvpStudents = eventSnap.data()?.rsvp || [];

      const isEventSaved = studentEvents.some(
        (ref) => ref.path === eventRef.path
      );
      const isStudentRSVPd = rsvpStudents.some(
        (ref) => ref.path === studentRef.path
      );

      setIsSaved(isEventSaved);
      setIsRSVPd(isStudentRSVPd);
    };
    fetchState();
  }, [user, studentRef, eventRef]);

  const toggleSave = async () => {
    if (!user) return;

    const studentSnap = await getDoc(studentRef);
    const current = studentSnap.data()?.events || [];

    const alreadySaved = current.some((ref) => ref.path === eventRef.path);
    const updated = alreadySaved
      ? current.filter((ref) => ref.path !== eventRef.path)
      : [...current, eventRef];
    await updateDoc(studentRef, { events: updated });
    setIsSaved(!alreadySaved);
  };

  const toggleRSVP = async () => {
    if (!user) return;

    const studentSnap = await getDoc(studentRef);
    const eventSnap = await getDoc(eventRef);

    const studentEvents = studentSnap.data()?.events || [];
    const rsvpList = eventSnap.data()?.rsvp || [];

    const alreadyRSVPd = rsvpList.some((ref) => ref.path === studentRef.path);

    const updatedStudentEvents = alreadyRSVPd
      ? studentEvents.filter((ref) => ref.path !== eventRef.path)
      : [...studentEvents, eventRef];

    const updatedEventRsvp = alreadyRSVPd
      ? rsvpList.filter((ref) => ref.path !== studentRef.path)
      : [...rsvpList, studentRef];

    await updateDoc(studentRef, { events: updatedStudentEvents });
    await updateDoc(eventRef, { rsvp: updatedEventRsvp });

    setIsRSVPd(!alreadyRSVPd);
    setIsSaved(!alreadyRSVPd);
  };

  return (
    <Card className="mb-6 rounded-lg overflow-hidden">
      <CardActionArea sx={{ display: "flex", alignItems: "flex-start" }}>
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

        <div
          style={{
            marginLeft: "0.75rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "0.5rem",
              paddingRight: "0.5rem",
              paddingLeft: "0.5rem",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRSVPd}
                  onChange={toggleRSVP}
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={isSaved}
                  onChange={toggleSave}
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
        </div>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
