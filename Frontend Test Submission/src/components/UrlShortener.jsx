import { useState } from "react";
import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { Log } from "../utils/log";

const DEFAULT_VALIDITY = 30;

export default function UrlShortener() {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);
  const token = import.meta.env.VITE_LOGGER_TOKEN;

  const handleChange = (idx, field, value) => {
    const updated = [...urls];
    updated[idx][field] = value;
    setUrls(updated);
  };

  const addUrlField = () => {
    if (urls.length < 5) setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
  };

  const removeUrlField = (idx) => {
    setUrls(urls.filter((_, i) => i !== idx));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResults([]);
    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, shortcode } = urls[i];
      if (!validateUrl(longUrl)) {
        await Log({
          stack: "frontend",
          level: "error",
          package: "handler",
          message: "Invalid URL format",
          token
        });
        alert(`Row ${i + 1}: Invalid URL`);
        return;
      }
      if (validity && (!Number.isInteger(Number(validity)) || Number(validity) <= 0)) {
        await Log({
          stack: "frontend",
          level: "error",
          package: "handler",
          message: "Validity must be a positive integer",
          token
        });
        alert(`Row ${i + 1}: Validity must be a positive integer`);
        return;
      }
      if (shortcode && !/^[a-zA-Z0-9]{1,16}$/.test(shortcode)) {
        await Log({
          stack: "frontend",
          level: "error",
          package: "handler",
          message: "Shortcode must be alphanumeric and up to 16 chars",
          token
        });
        alert(`Row ${i + 1}: Shortcode must be alphanumeric and up to 16 chars`);
        return;
      }
    }

    const responses = await Promise.all(urls.map(async ({ longUrl, validity, shortcode }) => {
      try {
        const res = await fetch("http://localhost:4000/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            longUrl,
            validity: validity ? Number(validity) : DEFAULT_VALIDITY,
            shortcode: shortcode || undefined
          })
        });
        const data = await res.json();
        if (!res.ok) {
          await Log({
            stack: "frontend",
            level: "error",
            package: "handler",
            message: data.message || "Unknown error",
            token
          });
          return { error: data.message || "Unknown error" };
        }
        return data;
      } catch (err) {
        await Log({
          stack: "frontend",
          level: "fatal",
          package: "handler",
          message: err.message,
          token
        });
        return { error: err.message };
      }
    }));
    setResults(responses);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {urls.map((row, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 2, mb: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      label="Long URL"
                      value={row.longUrl}
                      onChange={e => handleChange(idx, "longUrl", e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Validity (min)"
                      value={row.validity}
                      onChange={e => handleChange(idx, "validity", e.target.value)}
                      type="number"
                      inputProps={{ min: 1 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Custom Shortcode"
                      value={row.shortcode}
                      onChange={e => handleChange(idx, "shortcode", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={1}>
                    {urls.length > 1 && (
                      <Button color="error" onClick={() => removeUrlField(idx)}>-</Button>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={addUrlField} disabled={urls.length >= 5}>Add URL</Button>
          <Button type="submit" variant="contained" sx={{ ml: 2 }}>Shorten</Button>
        </Box>
      </form>
      <Box sx={{ mt: 4 }}>
        {results.map((res, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 1 }}>
            {res.error ? (
              <Typography color="error">Error: {res.error}</Typography>
            ) : (
              <>
                <Typography>Short URL: <a href={`http://localhost:3000/${res.shortcode}`} target="_blank" rel="noopener noreferrer">{`http://localhost:3000/${res.shortcode}`}</a></Typography>
                <Typography>Expires At: {res.expiry}</Typography>
                <Typography>Original URL: {res.longUrl}</Typography>
              </>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}