import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Store as StoreIcon,
  Payment as PaymentIcon,
  Mail as MailIcon,
  Security as SecurityIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import api from '../../../services/api';
import './SettingsPanel.css';

const SettingsPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    fetchSettings();
    fetchStaticData();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/system/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaticData = async () => {
    try {
      const [currenciesRes, timezonesRes] = await Promise.all([
        api.get('/system/currencies'),
        api.get('/system/timezones')
      ]);
      setCurrencies(currenciesRes.data);
      setTimezones(timezonesRes.data);
    } catch (error) {
      console.error('Error fetching static data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);
      await api.put('/system/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Store Name"
          name="storeName"
          value={settings.storeName || ''}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Store Email"
          name="storeEmail"
          value={settings.storeEmail || ''}
          onChange={handleChange}
          margin="normal"
          type="email"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Timezone</InputLabel>
          <Select
            name="timezone"
            value={settings.timezone || ''}
            onChange={handleChange}
            label="Timezone"
          >
            {timezones.map(tz => (
              <MenuItem key={tz} value={tz}>{tz}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Currency</InputLabel>
          <Select
            name="currency"
            value={settings.currency || ''}
            onChange={handleChange}
            label="Currency"
          >
            {currencies.map(currency => (
              <MenuItem key={currency.code} value={currency.code}>
                {currency.name} ({currency.symbol})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              name="maintenanceMode"
              checked={settings.maintenanceMode || false}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Maintenance Mode"
        />
      </Grid>
    </Grid>
  );

  const renderPaymentSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Payment Gateways
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  name="paymentSettings.stripeEnabled"
                  checked={settings.paymentSettings?.stripeEnabled || false}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Enable Stripe Payments"
            />
            {settings.paymentSettings?.stripeEnabled && (
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stripe Publishable Key"
                    name="paymentSettings.stripePublishableKey"
                    value={settings.paymentSettings?.stripePublishableKey || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stripe Secret Key"
                    name="paymentSettings.stripeSecretKey"
                    value={settings.paymentSettings?.stripeSecretKey || ''}
                    onChange={handleChange}
                    margin="normal"
                    type="password"
                  />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  name="paymentSettings.paypalEnabled"
                  checked={settings.paymentSettings?.paypalEnabled || false}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Enable PayPal Payments"
            />
            {settings.paymentSettings?.paypalEnabled && (
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="PayPal Client ID"
                    name="paymentSettings.paypalClientId"
                    value={settings.paymentSettings?.paypalClientId || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="PayPal Secret"
                    name="paymentSettings.paypalSecret"
                    value={settings.paymentSettings?.paypalSecret || ''}
                    onChange={handleChange}
                    margin="normal"
                    type="password"
                  />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderEmailSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SMTP Host"
          name="emailSettings.smtpHost"
          value={settings.emailSettings?.smtpHost || ''}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SMTP Port"
          name="emailSettings.smtpPort"
          value={settings.emailSettings?.smtpPort || ''}
          onChange={handleChange}
          margin="normal"
          type="number"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SMTP Username"
          name="emailSettings.smtpUsername"
          value={settings.emailSettings?.smtpUsername || ''}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SMTP Password"
          name="emailSettings.smtpPassword"
          value={settings.emailSettings?.smtpPassword || ''}
          onChange={handleChange}
          margin="normal"
          type="password"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              name="emailSettings.smtpSecure"
              checked={settings.emailSettings?.smtpSecure || false}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Use SSL/TLS"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="From Email"
          name="emailSettings.fromEmail"
          value={settings.emailSettings?.fromEmail || ''}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              name="securitySettings.httpsEnabled"
              checked={settings.securitySettings?.httpsEnabled || false}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Force HTTPS"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              name="securitySettings.twoFactorEnabled"
              checked={settings.securitySettings?.twoFactorEnabled || false}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Require Two-Factor Authentication for Admins"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Password Policy (Minimum Length)"
          name="securitySettings.passwordMinLength"
          value={settings.securitySettings?.passwordMinLength || 8}
          onChange={handleChange}
          margin="normal"
          type="number"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              name="securitySettings.passwordRequireSpecialChar"
              checked={settings.securitySettings?.passwordRequireSpecialChar || false}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Require Special Character in Passwords"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              name="securitySettings.passwordRequireNumber"
              checked={settings.securitySettings?.passwordRequireNumber || false}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Require Number in Passwords"
        />
      </Grid>
    </Grid>
  );

  return (
    <div className="settings-panel">
      <Typography variant="h4" gutterBottom>
        <SettingsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        System Settings
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<StoreIcon />} label="General" />
          <Tab icon={<PaymentIcon />} label="Payment" />
          <Tab icon={<MailIcon />} label="Email" />
          <Tab icon={<SecurityIcon />} label="Security" />
        </Tabs>
      </Box>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography>Loading settings...</Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ p: 2 }}>
                {tabValue === 0 && renderGeneralSettings()}
                {tabValue === 1 && renderPaymentSettings()}
                {tabValue === 2 && renderEmailSettings()}
                {tabValue === 3 && renderSecuritySettings()}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;