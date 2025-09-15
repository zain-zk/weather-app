import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

const App = () => {
  const [theme, setTheme] = useState("light");
  const isDark = theme === "dark";

  const [weather, setWeather] = useState(null);
  const [loader, setloader] = useState(false);
  const [error, seterror] = useState(null);

  const pakistaniCities = [];

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    setloader(true);
    setWeather(null);
    seterror(null);

    try {
      const API_KEY = "715e018da92059fe703427ccbadec95f";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        seterror("City not found in weather API");
      }
    } catch (err) {
      seterror("Failed to fetch weather");
    } 
    finally {
      setloader(false);
    }
  };

  return (
    <Box
      sx={{
        height: "95vh",
        bgcolor: isDark ? "#121212" : "#f5f5f5",
        color: isDark ? "#fff" : "#000",
        transition: "all 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 2,
      }}
    >
      {/* Theme Toggle */}
      <Box sx={{ display: "flex", gap: 2  }}>
        <Tooltip title="Light Theme">
          <IconButton onClick={() => setTheme("light")} color="warning" style={{fontSize:"3rem"}}>
            ☀️
          </IconButton>
        </Tooltip>
        <Tooltip title="Dark Theme">
          <IconButton onClick={() => setTheme("dark")} color="info"   style={{fontSize:"3rem"}}>
            🌙
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Weather App
      </Typography>

      {/* Search Input */}
      <Autocomplete
        freeSolo
        options={pakistaniCities}
        sx={{ width: 350 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter a city"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchWeather(e.target.value);
              }
            }}
            sx={{
              input: { color: isDark ? "#fff" : "#000" },
              label: { color: isDark ? "#bbb" : "#555" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: isDark ? "#aaa" : "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: isDark ? "#fff" : "#000",
                },
              },
            }}
          />
        )}
        // onChange={(event, newValue) => {
        //   if (newValue) {
        //     fetchWeather(newValue.label || newValue);
        //   }
        // }}
      />

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ width: "350px" }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Loader OR Weather */}
      {loader ? (
        <Box sx={{ mt: 3 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        weather && (
          <Card
            sx={{
              mt: 3,
              maxWidth: 400,
              bgcolor: isDark ? "#1e1e1e" : "#ffffff",
              color: isDark ? "#fff" : "#000",
              borderRadius: 3,
              boxShadow: isDark
                ? "0 0 20px rgba(255,255,255,0.2)"
                : "0 0 20px rgba(0,0,0,0.2)",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {weather.name}
              </Typography>
              <Typography variant="h4" gutterBottom>
                🌡 {weather.main.temp} °C
              </Typography>
              <Typography variant="body1">
                🌥 Condition: {weather.weather[0].description}
              </Typography>
              <Typography variant="body1">
                💨 Wind Speed: {weather.wind.speed} m/s
              </Typography>
              <Typography variant="body1">
                💧 Humidity: {weather.main.humidity}%
              </Typography>
            </CardContent>
          </Card>
        )
      )}
    </Box>
  );
};

export default App;
