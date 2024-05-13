/* eslint-disable react/prop-types */
import { Backdrop, CircularProgress, Typography } from "@mui/material";

const LoadingComponent = ({ loading }) => (
  <Backdrop
    sx={{
      color: "#fff",
      zIndex: ({ zIndex: { drawer } }) => drawer + 1,
    }}
    open={loading}
  >
    <Typography
      variant="subtitle1"
      component="p"
      sx={{ display: "flex", alignItems: "center", color: "black" }}
    >
      Please Wait &nbsp;{" "}
    </Typography>
    <CircularProgress />
  </Backdrop>
);

export default LoadingComponent;
