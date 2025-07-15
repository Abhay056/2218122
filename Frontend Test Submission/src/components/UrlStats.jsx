import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function UrlStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("shortenedUrls");
    if (stored) {
      setStats(JSON.parse(stored));
    }
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Statistics
      </Typography>
      {stats.length === 0 ? (
        <Typography>No URLs shortened yet.</Typography>
      ) : (
        stats.map((url, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">
              Short URL: <a href={`http://localhost:3000/${url.shortcode}`} target="_blank" rel="noopener noreferrer">
                {`http://localhost:3000/${url.shortcode}`}
              </a>
            </Typography>
            <Typography>Created At: {url.createdAt}</Typography>
            <Typography>Expires At: {url.expiry}</Typography>
            <Typography>Total Clicks: {url.clicks.length}</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {url.clicks.map((click, i) => (
                    <TableRow key={i}>
                      <TableCell>{click.timestamp}</TableCell>
                      <TableCell>{click.source}</TableCell>
                      <TableCell>{click.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))
      )}
    </Box>
  );
}