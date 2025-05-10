import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'تلفن',
      details: ['+1 (555) 123-4567', '+1 (555) 765-4321'],
    },
    {
      icon: <Email />,
      title: 'ایمیل',
      details: ['support@karno.com', 'sales@karno.com'],
    },
    {
      icon: <LocationOn />,
      title: 'آدرس',
      details: ['خیابان قطعات خودرو 123', 'سیلیکون ولی، کالیفرنیا 94025'],
    },
    {
      icon: <AccessTime />,
      title: 'ساعات کاری',
      details: ['دوشنبه تا جمعه: 9 صبح تا 6 عصر', 'شنبه: 10 صبح تا 4 عصر'],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ direction: 'rtl' }}>
          تماس با ما
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          align="center"
          sx={{ mb: 6, direction: 'rtl' }}
        >
          ما اینجا هستیم تا به شما کمک کنیم! پیام خود را ارسال کنید و ما در اسرع وقت پاسخ خواهیم داد.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ direction: 'rtl' }}>
                در تماس باشید
              </Typography>
              <Box sx={{ mt: 3 }}>
                {contactInfo.map((info) => (
                  <Paper
                    key={info.title}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        mr: 2,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {info.title}
                      </Typography>
                      {info.details.map((detail) => (
                        <Typography
                          key={detail}
                          variant="body2"
                          color="text.secondary"
                        >
                          {detail}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              {submitted && (
                <Alert severity="success" sx={{ mb: 3, direction: 'rtl' }}>
                  با تشکر از پیام شما! به زودی با شما تماس خواهیم گرفت.
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="نام"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      InputProps={{ sx: { direction: 'rtl' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="ایمیل"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      InputProps={{ sx: { direction: 'ltr' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="موضوع"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      InputProps={{ sx: { direction: 'rtl' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      label="پیام"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      InputProps={{ sx: { direction: 'rtl' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                    >
                      ارسال پیام
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Contact;
