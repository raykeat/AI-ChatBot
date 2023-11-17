import HomePage from "./components/HomePage.jsx";

/* importing necessary components and functions from Material-UI and React
to set up and apply a custom theme. */ 
import { useMemo } from "react";
import { CssBaseline, ThemeProvider} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";


function App() {

  {/* useMemo hook to create and memoize the theme based on the selected mode. 
  The [mode] dependency array specifies that the theme object should only be recalculated 
  when the mode value changes. If the mode remains the same, 
  the previously calculated theme object is returned from the memoized cache. */}
  const theme = useMemo(() => createTheme(themeSettings("dark")), ["dark"]);

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />

      <HomePage />

    </ThemeProvider>
  );

}

export default App;
