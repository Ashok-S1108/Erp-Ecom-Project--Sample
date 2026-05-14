import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Alert,
  Divider
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import './Contact.css';

const Contact = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const contactInfo = [
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Email',
      details: 'support@shopeasy.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40 }} />,
      title: 'Address',
      details: '123 Commerce Street',
      description: 'New York, NY 10001, USA'
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      title: 'Business Hours',
      details: '24/7 Customer Support',
      description: 'Live chat available round the clock'
    }
  ];

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <Box className="contact-page">
      {/* Hero Section */}
      <Box className="contact-hero">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', margin: '0 auto' }}>
              We'd love to hear from you. Get in touch with our team for any questions or feedback.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h2" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have questions about our products or services? We're here to help. 
                Reach out to us through any of the following channels.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {contactInfo.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ color: 'primary.main', mb: 2 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {item.details}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" component="h3" gutterBottom>
                Send us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <Divider sx={{ my: 3 }} />

              {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you soon.
                </Alert>
              )}

              {submitStatus === 'error' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  There was an error sending your message. Please try again.
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters'
                        }
                      })}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters'
                        }
                      })}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      {...register('subject', {
                        required: 'Subject is required',
                        minLength: {
                          value: 5,
                          message: 'Subject must be at least 5 characters'
                        }
                      })}
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      {...register('message', {
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters'
                        }
                      })}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<SendIcon />}
                      sx={{ py: 1.5 }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                question: 'How long does shipping take?',
                answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.'
              },
              {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day return policy for unused items in original packaging with receipt.'
              },
              {
                question: 'Do you ship internationally?',
                answer: 'Yes, we ship to over 50 countries worldwide. Shipping rates and times vary by location.'
              },
              {
                question: 'How can I track my order?',
                answer: 'You will receive a tracking number via email once your order ships. You can also track it in your account.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.'
              },
              {
                question: 'Can I modify my order after placing it?',
                answer: 'Orders can be modified within 1 hour of placement. Contact us immediately for assistance.'
              }
            ].map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;