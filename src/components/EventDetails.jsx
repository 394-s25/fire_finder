import { Modal, Box, IconButton, Typography, Button, Checkbox, FormControlLabel } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import TodayIcon from '@mui/icons-material/Today';

//made edits
const EventDetails = ({
    open,
    onClose,
    title,
    description,
    image,
    location,
    startDate,
    endDate,
    isSaved,
    isRSVPd,
    toggleSave,
    toggleRSVP,
    getGoogleCalendarUrl,
    }) => {
    return (
        <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
        sx={{ width: "100%", height: "100%" }}
        >
            <Box
                sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: '95%',
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: "8px",
                overflow: "hidden",
                maxHeight: "90vh",
                overflowY: "auto",
                }}
            >
                <IconButton
                onClick={onClose}
                sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                >
                    <CloseIcon sx = {{color: 'red'}}/>
                </IconButton>
                <div className="flex flex-col">
                {/* Banner Image */}
                    <Box sx={{ width: "100%", height: "400px", overflow: "scroll", alignItems: "center", justifyContent: "center", display: "flex", backgroundColor: "black" }}>
                        <img
                        src={image}
                        alt={`${title} banner`}
                        />
                    </Box>
                    {/* Content Section */}
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, padding: "1rem" }}>
                        {/* Left 3/4: Event Details */}
                        <div className="md:w-3/4 pr-4" >
                            <Typography
                                id="event-modal-title"
                                variant="h4"
                                component="h2"
                                className="mb-4 font-bold"
                                mb = {1}
                                fontWeight="bold"
                            >
                                {title}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexDirection: "row" }}>
                                <LocationOnIcon sx={{ color: "#f97316", mr: 1 }} />
                                <Typography variant="body1" className="text-gray-600">
                                {location}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexDirection: "row" }}>
                                <TodayIcon sx={{ color: "#f97316", mr: 1 }} />
                                <Typography variant="body1" className="text-gray-600 mb-4">
                                    {startDate?.toLocaleDateString([], {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {endDate?.toLocaleDateString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    })}
                                </Typography>
                            </Box>
                            <Typography
                                id="event-modal-description"
                                variant="body1"
                                className="text-gray-600"
                            >
                                {description.split("\n").map((line, index) => (
                                <p key={index} className="m-0">
                                    {line}
                                </p>
                                ))}
                            </Typography>
                        </div>
                        {/* Right 1/4: Save and RSVP */}
                        <Box sx={{ width:"25%" , padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={isSaved}
                                    onChange={toggleSave}
                                    sx={{
                                    display: "flex",
                                    color: "#f97316",
                                    "&.Mui-checked": { color: "#f97316" },
                                    }}
                                />
                                }
                                label="Save"
                                sx={{
                                border: "1px solid #f97316",
                                borderRadius: "0.25rem",
                                width: "100px",
                                display: "flex",
                                ml: 2,
                                color: "#f97316",
                                "&:hover": {
                                    backgroundColor: "rgba(249, 115, 22, 0.05)",
                                },
                                mb: 2,
                                }}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={isRSVPd}
                                    onChange={toggleRSVP}
                                    sx={{
                                    display: "flex",
                                    color: "#f97316",
                                    "&.Mui-checked": { color: "#f97316" },
                                    }}
                                />
                                }
                                label="RSVP"
                                sx={{
                                border: "1px solid #f97316",
                                borderRadius: "0.25rem",
                                width: "100px",
                                display: "flex",
                                ml: 2,
                                color: "#f97316",
                                "&:hover": {
                                    backgroundColor: "rgba(249, 115, 22, 0.05)",
                                },
                                mb: 2,
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
                                    variant="outlined"
                                    sx={{
                                    borderColor: "#f97316",
                                    color: "#f97316",
                                    width: "100%",
                                    maxWidth: "200px",
                                    }}
                                >
                                    Add to Calendar
                                </Button>
                                </a>
                            )}  
                        </Box>
                    </Box>
                </div>
            </Box>
        </Modal>
    );
};

export default EventDetails;