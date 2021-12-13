import React from "react";
import { Formik, Form, Field } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import * as yup from "yup";
import { Button, Container, Paper, Grid, Typography } from "@mui/material";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const WithMaterialUI = () => {
  return (
    <Container
      sx={(theme) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
      })}
    >
      <Typography variant="h4" align="center" m={3}>
        Sign Up
        <Typography paragraph>
          One step closer to finding local events for your food business!
        </Typography>
      </Typography>
      <Grid container spacing={0} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper>
            <Container
              sx={(theme) => ({
                flexGrow: 1,
                padding: theme.spacing(3),
              })}
            >
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  isEventPlanner: false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  alert(JSON.stringify(values, null, 2));
                }}
              >
                <Form>
                  <Field
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    component={TextField}
                    variant="standard"
                    fullWidth
                  />
                  <Field
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    component={TextField}
                  />
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="isEventPlanner"
                    Label={{ label: "I am an event planner" }}
                  />
                  <Button variant="outlined" fullWidth type="submit">
                    Sign Up
                  </Button>
                </Form>
              </Formik>
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WithMaterialUI;
