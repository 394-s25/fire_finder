import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

const TradeInterestChart = ({ height = 400, showDataLabels = true }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const theme = useTheme();

  // Color palette for different trade interests
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
    "#dda0dd",
    "#98fb98",
    "#f0e68c",
    "#ff6347",
    "#40e0d0",
    "#ee82ee",
    "#90ee90",
  ];

  useEffect(() => {
    fetchTradeInterestData();
  }, []);

  const fetchTradeInterestData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all students from the students collection
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const students = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Count trade interests
      const tradeInterestCounts = {};
      let studentsWithTradeInterest = 0;

      // Process each student
      for (const student of students) {
        const interests = student.interests;

        if (Array.isArray(interests) && interests.length > 0) {
          // Process each interest reference in the array
          for (const interestRef of interests) {
            try {
              console.log("Processing interest reference:", interestRef);
              console.log("Reference type:", typeof interestRef);
              console.log(
                "Reference constructor:",
                interestRef.constructor.name
              );

              // Get the document reference and fetch the trade document
              const tradeDoc = await getDoc(interestRef);

              if (tradeDoc.exists()) {
                const tradeData = tradeDoc.data();
                console.log("Trade document data:", tradeData);
                console.log("Trade document ID:", tradeDoc.id);

                // Get the trade name from the name field
                const tradeName =
                  tradeData.name ||
                  tradeData.title ||
                  tradeData.category ||
                  `Unknown Trade (${tradeDoc.id.slice(-6)})`;

                console.log("Final trade name:", tradeName);

                if (tradeInterestCounts[tradeName]) {
                  tradeInterestCounts[tradeName]++;
                } else {
                  tradeInterestCounts[tradeName] = 1;
                }
              } else {
                console.log(
                  "Trade document does not exist for reference:",
                  interestRef
                );
                const unknownTrade = "Document Not Found";
                if (tradeInterestCounts[unknownTrade]) {
                  tradeInterestCounts[unknownTrade]++;
                } else {
                  tradeInterestCounts[unknownTrade] = 1;
                }
              }
            } catch (error) {
              console.error("Error fetching trade document:", error);
              console.error("Problem reference:", interestRef);

              // Handle error case
              const errorTrade = "Error Loading Trade";
              if (tradeInterestCounts[errorTrade]) {
                tradeInterestCounts[errorTrade]++;
              } else {
                tradeInterestCounts[errorTrade] = 1;
              }
            }
          }
        } else {
          // No interests specified
          const noInterest = "Not Specified";
          if (tradeInterestCounts[noInterest]) {
            tradeInterestCounts[noInterest]++;
          } else {
            tradeInterestCounts[noInterest] = 1;
          }
        }
      }

      // Convert to chart data format and sort by count
      const formattedData = Object.entries(tradeInterestCounts)
        .map(([interest, count]) => ({
          tradeInterest: interest,
          studentCount: count,
          percentage: ((count / students.length) * 100).toFixed(1),
        }))
        .sort((a, b) => b.studentCount - a.studentCount);

      setChartData(formattedData);
      setTotalStudents(students.length);
    } catch (err) {
      console.error("Error fetching trade interest data:", err);
      setError("Failed to load trade interest data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: "white",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {label}
          </Typography>
          <Typography variant="body2" color="primary">
            Students: {data.studentCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentage: {data.percentage}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const formatXAxisLabel = (value) => {
    // Truncate long labels for better display
    return value.length > 12 ? `${value.substring(0, 12)}...` : value;
  };

  if (loading) {
    return (
      <Card sx={{ height: height + 100 }}>
        <CardHeader title="Trade Interest Distribution" />
        <CardContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={height - 50}
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: height + 100 }}>
        <CardHeader title="Trade Interest Distribution" />
        <CardContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: height + 100 }}>
      <CardHeader
        title="Trade Interest Distribution"
        subheader={`Total Students: ${totalStudents}`}
        action={
          <Chip
            label={`${chartData.length} Categories`}
            color="primary"
            variant="outlined"
            size="small"
          />
        }
      />
      <CardContent>
        <Box sx={{ width: "100%", height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="tradeInterest"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
                tickFormatter={formatXAxisLabel}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: "Number of Students",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="studentCount" name="Students" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Stats */}
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {chartData.slice(0, 5).map((item, index) => (
            <Chip
              key={item.tradeInterest}
              label={`${item.tradeInterest}: ${item.studentCount}`}
              sx={{
                backgroundColor: colors[index % colors.length],
                color: "white",
                fontWeight: "bold",
              }}
              size="small"
            />
          ))}
          {chartData.length > 5 && (
            <Chip
              label={`+${chartData.length - 5} more`}
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TradeInterestChart;
