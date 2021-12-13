import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Fab from "@mui/material/Fab";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Toolbar from "@mui/material/Toolbar";
import TruckSvg from "../components/TruckComponent";
import TruckImage from "../../public/Group_36.png";
import text from "../../public/Find_the_right_food_for_your_occasion._Find_the_right_occasion_for_your_food.png";
import { NextLinkComposed } from "../components/Link";
import { alpha, Box } from "@mui/system";
import Image from "next/image";

function LandingPage() {
  const [isEventPlanner, setEventPlanner] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        <Box
          sx={(theme) => ({
            flexGrow: 1,
            padding: theme.spacing(2),
            [theme.breakpoints.down("xs")]: {
              display: "none",
            },
            backgroundColor: "rgba(126, 124, 114, 0.43)",
          })}
        >
          <Toolbar />
          <Container>
            <TruckSvg />
            <Grid container>
              <Paper
                sx={(theme) => ({
                  padding: theme.spacing(1),
                  marginLeft: theme.spacing(2),
                  marginRight: theme.spacing(2),
                  textAlign: "left",
                  zIndex: 1,
                  right: "25%",
                  [theme.breakpoints.down("md")]: {
                    right: "15%",
                  },
                  [theme.breakpoints.down("sm")]: {
                    right: "5%",
                  },
                  position: "absolute",
                  top: "20%",
                  backgroundColor: alpha("#ffffff", 0.92),
                  height: "147px",
                  boxShadow: "0 6px 6px rgba(0, 0, 0, 0.16)",
                  borderRadius: "37px",
                })}
                onChange={(e) => setEventPlanner(true)}
              >
                <Grid item xs={12} sm={12}>
                  <FormControl>
                    <InputLabel>I am a</InputLabel>
                    <NativeSelect id="userType" name="isEventPlanner">
                      <option value="" />
                      <option value={"false"}>Vendor</option>
                      <option value={"true"}>Event Planner</option>
                    </NativeSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControl>
                    <InputLabel>looking for</InputLabel>
                    <NativeSelect id="userType" name="isEventPlanner">
                      <option value="" />
                      <option value={"false"}>Events</option>
                      <option value={"true"}>
                        Food Trucks to Cater My Event
                      </option>
                    </NativeSelect>
                  </FormControl>
                </Grid>
                <Fab
                  sx={{
                    position: "absolute",
                    bottom: "-15px",
                    right: "25%",
                  }}
                  size="small"
                  color="primary"
                  to={{
                    pathname: "/register",
                  }}
                  component={NextLinkComposed}
                >
                  <ArrowForwardIcon />
                </Fab>
              </Paper>
            </Grid>
          </Container>
        </Box>
        <Box
          sx={(theme) => ({
            flexGrow: 1,
            padding: theme.spacing(8),
            [theme.breakpoints.down("xs")]: {
              display: "none",
            },
          })}
        >
          <Container>
            <Typography variant="h4" p={6}>
              How can FORKITUP help?
              <Container>
                <Typography variant="h6">
                  Forkitup is a business platform specifically designed to help
                  facilitate and maintain the connections made between vendors
                  and clients. Forkitup has designed its platform specifically
                  to cater to the needs of the vendors and clients to nourish
                  those connections and promote the growth of their business.
                </Typography>
              </Container>
            </Typography>
          </Container>
        </Box>
      </Box>
      {/* : */}
      <Box
        sx={(theme) => ({
          flexGrow: 2,
          padding: theme.spacing(2),
          textAlign: "center",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "rgba(126, 124, 114, 0.43)",
          display: {
            sm: "none",
            xs: "block",
          },
        })}
      >
        <Toolbar />
        <Container
          sx={{
            left: "-440px",
            top: "291px",
            position: "absolute",
          }}
        >
          <Image src={TruckImage} alt="Food Truck" />
        </Container>
        <Grid container direction="column">
          <Grid item>
            <Image src={text} alt="Find the right food for your event" />
          </Grid>
          <Grid item>
            <Paper
              sx={(theme) => ({
                backgroundColor: alpha("#ffffff", 0.92),
                padding: theme.spacing(1),
                zIndex: 1,
                display: "inline-block",
                position: "absolute",
                left: "15px",
                top: "40%",
                width: "90%",
                height: "147px",
                boxShadow: "0 6px 6px rgba(0, 0, 0, 0.16)",
                borderRadius: "37px",
              })}
              onChange={(e) => setEventPlanner(true)}
            >
              <Grid item xs={12} sm={12}>
                <FormControl>
                  <InputLabel>I am a</InputLabel>
                  <NativeSelect id="userType" name="isEventPlanner">
                    <option value="" />
                    <option value={"false"}>Vendor</option>
                    <option value={"true"}>Event Planner</option>
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl>
                  <InputLabel>looking for</InputLabel>
                  <NativeSelect id="userType" name="isEventPlanner">
                    <option value="" />
                    <option value={"false"}>Events</option>
                    <option value={"true"}>
                      Food Trucks to Cater My Event
                    </option>
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Fab
                size="small"
                color="primary"
                to={{
                  pathname: "/register",
                }}
                component={NextLinkComposed}
              >
                <ArrowForwardIcon />
              </Fab>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default LandingPage;
