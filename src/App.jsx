// src/App.jsx
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  CssBaseline,
  Switch,
  FormControlLabel,
  TextareaAutosize,
  Divider,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmailIcon from "@mui/icons-material/Email";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

const validationSchema = Yup.object({
  dateDebut: Yup.date().nullable().required("La date de début est obligatoire"),
  dateFin: Yup.date()
    .nullable()
    .required("La date de fin est obligatoire")
    .min(
      Yup.ref("dateDebut"),
      "La date de fin doit être après la date de début"
    ),
  nombreAdultes: Yup.number()
    .required("Le nombre d'adultes est obligatoire")
    .min(1, "Au moins un adulte est requis")
    .max(10, "Maximum 10 adultes"),
  personnes: Yup.array().of(Yup.string().required("Le prénom est obligatoire")),
  aDesPitchounes: Yup.boolean(),
  nombreEnfants: Yup.number()
    .min(0, "Le nombre d'enfants ne peut pas être négatif")
    .when("aDesPitchounes", {
      is: true,
      then: (schema) =>
        schema
          .required("Le nombre d'enfants est requis si vous avez coché la case")
          .min(0),
      otherwise: (schema) => schema,
    }),
  commentaire: Yup.string(),
});

const initialValues = {
  venirPourNoel: true,
  dateDebut: dayjs("2024-12-20"),
  dateFin: dayjs("2025-01-10"),
  nombreAdultes: 2,
  personnes: ["", ""],
  aDesPitchounes: false,
  nombreEnfants: 0,
  commentaire: "",
};

function App() {
  const [showInfoCard, setShowInfoCard] = useState(true);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Valeurs soumises :", values);
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 500);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 2 }}>
        <Container maxWidth="md">
          {showInfoCard && (
            <Card sx={{ mb: 2, position: "relative", bgcolor: "#f8f9fa" }}>
              <CardContent sx={{ pr: 6 }}>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  >
                    Hello ! Cette page a pour but de commencer à réfléchir à la
                    répartition des lits pour Noël ! Si t'as la moindre
                    question, hésite pas à nous écrire sur Messenger ou par{" "}
                    <Box component="span" sx={{ color: "#1976d2" }}>
                      email{" "}
                      <EmailIcon
                        fontSize="small"
                        sx={{
                          verticalAlign: "middle",
                          fontSize: "1rem",
                          ml: 0.5,
                        }}
                      />
                    </Box>{" "}
                    !{" "}
                    <span role="img" aria-label="smile">
                      😊
                    </span>
                  </Typography>
                </Box>
              </CardContent>
              <IconButton
                aria-label="close"
                onClick={() => setShowInfoCard(false)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </Card>
          )}

          <Paper elevation={2} sx={{ p: 3, bgcolor: "white" }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                <Form>
                  <Box mb={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.venirPourNoel}
                          onChange={(e) =>
                            setFieldValue("venirPourNoel", e.target.checked)
                          }
                          color="primary"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#1976d2",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#1976d2",
                              },
                          }}
                        />
                      }
                      label="Je viens pour noël !"
                    />
                  </Box>

                  <Box mb={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5}>
                        <Box display="flex" alignItems="center">
                          <Typography component="span" sx={{ mr: 1 }}>
                            De :
                          </Typography>
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="fr"
                          >
                            <DatePicker
                              value={values.dateDebut}
                              onChange={(date) =>
                                setFieldValue("dateDebut", date)
                              }
                              format="ddd D MMM"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  error:
                                    touched.dateDebut &&
                                    Boolean(errors.dateDebut),
                                  helperText:
                                    touched.dateDebut && errors.dateDebut,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Typography component="span" sx={{ mx: 1 }}>
                          à
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="fr"
                        >
                          <DatePicker
                            value={values.dateFin}
                            onChange={(date) => setFieldValue("dateFin", date)}
                            minDate={values.dateDebut}
                            format="ddd D MMM"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "small",
                                error:
                                  touched.dateFin && Boolean(errors.dateFin),
                                helperText: touched.dateFin && errors.dateFin,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                    {errors.dateFin &&
                      touched.dateFin &&
                      typeof errors.dateFin === "string" &&
                      errors.dateFin.includes("après") && (
                        <Typography
                          color="error"
                          variant="caption"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          {errors.dateFin}
                        </Typography>
                      )}
                  </Box>

                  <Box mb={3}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography component="span" sx={{ mr: 2 }}>
                        Nombre d'adultes :
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                        }}
                      >
                        <IconButton
                          onClick={() => {
                            const newAdults = Math.max(
                              1,
                              values.nombreAdultes - 1
                            );
                            setFieldValue("nombreAdultes", newAdults);
                            const currentPersonnes = [...values.personnes];
                            if (currentPersonnes.length > newAdults) {
                              setFieldValue(
                                "personnes",
                                currentPersonnes.slice(0, newAdults)
                              );
                            }
                          }}
                          size="small"
                          sx={{ borderRadius: "4px 0 0 4px" }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Box
                          sx={{
                            px: 3,
                            py: 1,
                            minWidth: "40px",
                            textAlign: "center",
                            borderLeft: "1px solid #e0e0e0",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          {values.nombreAdultes}
                        </Box>
                        <IconButton
                          onClick={() => {
                            const newValue = Math.min(
                              10,
                              values.nombreAdultes + 1
                            );
                            setFieldValue("nombreAdultes", newValue);
                            const currentPersonnes = [...values.personnes];
                            if (currentPersonnes.length < newValue) {
                              while (currentPersonnes.length < newValue) {
                                currentPersonnes.push("");
                              }
                            }
                            setFieldValue("personnes", currentPersonnes);
                          }}
                          size="small"
                          sx={{ borderRadius: "0 4px 4px 0" }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    {touched.nombreAdultes && errors.nombreAdultes && (
                      <Typography
                        color="error"
                        variant="caption"
                        display="block"
                        sx={{ mb: 1 }}
                      >
                        {errors.nombreAdultes}
                      </Typography>
                    )}

                    <Grid container spacing={2}>
                      {[...Array(values.nombreAdultes)].map((_, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            fullWidth
                            placeholder={`Prénom Adulte ${index + 1}`}
                            value={values.personnes[index] || ""}
                            onChange={(e) => {
                              const newPersonnes = [...values.personnes];
                              newPersonnes[index] = e.target.value;
                              setFieldValue("personnes", newPersonnes);
                            }}
                            size="small"
                            variant="outlined"
                            error={
                              touched.personnes &&
                              touched.personnes[index] &&
                              Boolean(errors.personnes?.[index])
                            }
                            helperText={
                              touched.personnes &&
                              touched.personnes[index] &&
                              errors.personnes?.[index]
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box mb={3}>
                    {values.personnes[0] &&
                      values.personnes[0].trim() !== "" && (
                        <Box mb={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={values.aDesPitchounes}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  setFieldValue("aDesPitchounes", isChecked);
                                  if (!isChecked) {
                                    setFieldValue("nombreEnfants", 0);
                                  }
                                }}
                                color="primary"
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#1976d2",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                    { backgroundColor: "#1976d2" },
                                }}
                              />
                            }
                            label="J'ai des pitchounes !"
                          />
                        </Box>
                      )}
                    {values.aDesPitchounes && (
                      <Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Typography component="span" sx={{ mr: 2 }}>
                            Nombre d'enfants :
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: "4px",
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                setFieldValue(
                                  "nombreEnfants",
                                  Math.max(0, values.nombreEnfants - 1)
                                )
                              }
                              size="small"
                              sx={{ borderRadius: "4px 0 0 4px" }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Box
                              sx={{
                                px: 3,
                                py: 1,
                                minWidth: "40px",
                                textAlign: "center",
                                borderLeft: "1px solid #e0e0e0",
                                borderRight: "1px solid #e0e0e0",
                              }}
                            >
                              {values.nombreEnfants}
                            </Box>
                            <IconButton
                              onClick={() =>
                                setFieldValue(
                                  "nombreEnfants",
                                  values.nombreEnfants + 1
                                )
                              }
                              size="small"
                              sx={{ borderRadius: "0 4px 4px 0" }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        {touched.nombreEnfants && errors.nombreEnfants && (
                          <Typography
                            color="error"
                            variant="caption"
                            display="block"
                            sx={{ mb: 1 }}
                          >
                            {errors.nombreEnfants}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body1" gutterBottom>
                      Tu vois quelque chose à ajouter ?
                    </Typography>
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Écris ici 😊"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0",
                        fontSize: "16px",
                        fontFamily: "inherit",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }}
                      value={values.commentaire}
                      onChange={(e) =>
                        setFieldValue("commentaire", e.target.value)
                      }
                    />
                  </Box>

                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isSubmitting}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: "#0a819c",
                        "&:hover": { bgcolor: "#086f86" },
                        px: 3,
                      }}
                    >
                      Confirmer les dates
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default App;
