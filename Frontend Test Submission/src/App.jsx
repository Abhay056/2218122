import { useState, useEffect } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { log } from "./logging.js";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function generateShortcode(existingShortcodes) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    code = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  } while (existingShortcodes.has(code));
  return code;
}

function getNowISO() {
  return new Date().toISOString();
}

function getExpiryISO(minutes) {
  return new Date(Date.now() + minutes * 60000).toISOString();
}

function loadShortenedUrls() {
  try {
    return JSON.parse(localStorage.getItem("shortenedUrls")) || [];
  } catch {
    return [];
  }
}

function saveShortenedUrls(urls) {
  localStorage.setItem("shortenedUrls", JSON.stringify(urls));
}

function ShortenerPage() {
  const [inputs, setInputs] = useState([
    { longUrl: "", validity: "", shortcode: "" },
  ]);
  const [errors, setErrors] = useState([{}]);
  const [results, setResults] = useState(loadShortenedUrls());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    saveShortenedUrls(results);
  }, [results]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateInputs = () => {
    const existingShortcodes = new Set(results.map((r) => r.shortcode));
    const errs = inputs.map((input, idx) => {
      const err = {};
      if (!input.longUrl) err.longUrl = "URL required";
      else if (!validateUrl(input.longUrl)) err.longUrl = "Invalid URL";
      if (
        input.validity &&
        (!/^[0-9]+$/.test(input.validity) || parseInt(input.validity) <= 0)
      )
        err.validity = "Enter positive integer (minutes)";
      if (input.shortcode) {
        if (!/^[a-zA-Z0-9]{4,12}$/.test(input.shortcode))
          err.shortcode = "4-12 alphanumeric chars";
        else if (existingShortcodes.has(input.shortcode))
          err.shortcode = "Shortcode already used";
      }
      return err;
    });
    setErrors(errs);
    return errs.every((e) => Object.keys(e).length === 0);
  };

  const handleInputChange = (idx, field, value) => {
    setInputs((inputs) =>
      inputs.map((input, i) =>
        i === idx ? { ...input, [field]: value } : input
      )
    );
  };

  const handleAdd = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: "", validity: "", shortcode: "" }]);
      setErrors([...errors, {}]);
    }
  };

  const handleRemove = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
    setErrors(errors.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!validateInputs()) {
      await log("ShortenerPage", "error", "frontend", "Validation failed");
      setSubmitting(false);
      return;
    }
    const existingShortcodes = new Set(results.map((r) => r.shortcode));
    const newResults = [];
    for (let i = 0; i < inputs.length; ++i) {
      const { longUrl, validity, shortcode } = inputs[i];
      let code = shortcode || generateShortcode(existingShortcodes);
      existingShortcodes.add(code);
      const createdAt = getNowISO();
      const expiresAt = getExpiryISO(validity ? parseInt(validity) : 30);
      const newEntry = {
        longUrl,
        shortcode: code,
        createdAt,
        expiresAt,
        clicks: [],
      };
      newResults.push(newEntry);
      await log(
        "ShortenerPage",
        "info",
        "frontend",
        `Shortened: ${longUrl} as ${code}`
      );
    }
    setResults([...results, ...newResults]);
    setInputs([{ longUrl: "", validity: "", shortcode: "" }]);
    setErrors([{}]);
    setSubmitting(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {inputs.map((input, idx) => (
              <Grid item xs={12} key={idx}>
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    label="Long URL"
                    value={input.longUrl}
                    onChange={(e) =>
                      handleInputChange(idx, "longUrl", e.target.value)
                    }
                    error={!!errors[idx]?.longUrl}
                    helperText={errors[idx]?.longUrl}
                    fullWidth
                  />
                  <TextField
                    label="Validity (min)"
                    value={input.validity}
                    onChange={(e) =>
                      handleInputChange(idx, "validity", e.target.value)
                    }
                    error={!!errors[idx]?.validity}
                    helperText={errors[idx]?.validity || "Default: 30"}
                    sx={{ width: 120 }}
                  />
                  <TextField
                    label="Custom Shortcode"
                    value={input.shortcode}
                    onChange={(e) =>
                      handleInputChange(idx, "shortcode", e.target.value)
                    }
                    error={!!errors[idx]?.shortcode}
                    helperText={errors[idx]?.shortcode || "Optional"}
                    sx={{ width: 180 }}
                  />
                  {inputs.length > 1 && (
                    <IconButton
                      onClick={() => handleRemove(idx)}
                      aria-label="remove">
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  disabled={inputs.length >= 5}>
                  Add URL
                </Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  Shorten
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Typography variant="h5" gutterBottom>
        Shortened URLs
      </Typography>
      <Paper sx={{ p: 2 }}>
        {results.length === 0 ? (
          <Typography>No URLs shortened yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {results.map((r, idx) => (
              <Grid item xs={12} key={idx}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body1" sx={{ minWidth: 120 }}>
                    <a
                      href={`/${r.shortcode}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      {window.location.origin}/{r.shortcode}
                    </a>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, wordBreak: "break-all" }}>
                    {r.longUrl}
                  </Typography>
                  <Typography variant="caption">
                    Created: {new Date(r.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="caption">
                    Expires: {new Date(r.expiresAt).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

function StatsPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    setUrls(loadShortenedUrls());
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <Paper sx={{ p: 3 }}>
        {urls.length === 0 ? (
          <Typography>No URLs shortened yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" fontWeight="bold" gap={2}>
                <Box sx={{ minWidth: 120 }}>Shortcode</Box>
                <Box sx={{ flex: 1 }}>Original URL</Box>
                <Box sx={{ minWidth: 120 }}>Created</Box>
                <Box sx={{ minWidth: 120 }}>Expires</Box>
                <Box sx={{ minWidth: 80 }}>Clicks</Box>
              </Box>
            </Grid>
            {urls.map((r, idx) => (
              <Grid item xs={12} key={idx}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ minWidth: 120 }}>{r.shortcode}</Box>
                  <Box sx={{ flex: 1, wordBreak: "break-all" }}>
                    {r.longUrl}
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    {new Date(r.createdAt).toLocaleString()}
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    {new Date(r.expiresAt).toLocaleString()}
                  </Box>
                  <Box sx={{ minWidth: 80 }}>
                    {r.clicks ? r.clicks.length : 0}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urls = loadShortenedUrls();
    const entryIdx = urls.findIndex((r) => r.shortcode === shortcode);
    if (entryIdx === -1) {
      setStatus("error");
      setMessage("Shortcode not found.");
      return;
    }
    const entry = urls[entryIdx];
    const now = new Date();
    if (new Date(entry.expiresAt) < now) {
      setStatus("error");
      setMessage("This link has expired.");
      return;
    }
    // Log the click
    const click = { timestamp: now.toISOString() };
    entry.clicks = entry.clicks || [];
    entry.clicks.push(click);
    urls[entryIdx] = entry;
    saveShortenedUrls(urls);
    setStatus("redirecting");
    setMessage("Redirecting...");
    setTimeout(() => {
      window.location.href = entry.longUrl;
    }, 1200);
  }, [shortcode]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          {status === "loading" && "Checking link..."}
          {status === "redirecting" && "Redirecting..."}
          {status === "error" && "Error"}
        </Typography>
        <Typography>{message}</Typography>
        {status === "error" && (
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}>
            Go Home
          </Button>
        )}
      </Paper>
    </Container>
  );
}

function App() {
  useEffect(() => {
    log("App", "info", "frontend", "App loaded");
  }, []);
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<ShortenerPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path=":shortcode" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;
