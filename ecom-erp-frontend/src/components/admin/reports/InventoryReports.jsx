import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography 
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import api from '../../../services/api';
import './InventoryReports.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InventoryReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('status');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    fetchReportData();
  }, [reportType, locationFilter]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = {
        type: reportType,
        location: locationFilter === 'all' ? undefined : locationFilter
      };
      const response = await api.get('/reports/inventory', { params });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Implement export functionality
  };

  const renderChart = () => {
    if (!reportData) return <Typography>No data available</Typography>;

    switch (reportType) {
      case 'status':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.statusSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Item Count" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'location':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={reportData.locationSummary}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                nameKey="location"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {reportData.locationSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'value':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.valueByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Inventory Value']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Inventory Value ($)" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderAlerts = () => {
    if (!reportData?.alerts?.length) return null;

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <WarningIcon color="warning" sx={{ verticalAlign: 'middle', mr: 1 }} />
            Inventory Alerts
          </Typography>
          <Grid container spacing={2}>
            {reportData.alerts.map((alert, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" className="alert-card">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {alert.product}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      SKU: {alert.sku} | Location: {alert.location}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Chip
                        label={`Current: ${alert.currentStock}`}
                        color="default"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`Threshold: ${alert.threshold}`}
                        color="warning"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="inventory-reports">
      <div className="report-header">
        <Typography variant="h4">Inventory Reports</Typography>
        <div className="report-actions">
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
          >
            PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('excel')}
          >
            Excel
          </Button>
        </div>
      </div>

      <Card className="report-controls">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="status">Inventory Status</MenuItem>
                  <MenuItem value="location">By Location</MenuItem>
                  <MenuItem value="value">Inventory Value</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="all">All Locations</MenuItem>
                  {reportData?.locations?.map(location => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className="report-content">
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={10}>
              <Typography>Loading report data...</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {reportType === 'status' && 'Inventory Status Overview'}
                {reportType === 'location' && 'Inventory Distribution by Location'}
                {reportType === 'value' && 'Inventory Value by Category'}
              </Typography>
              {renderChart()}

              <Grid container spacing={3} mt={2}>
                <Grid item xs={12} md={4}>
                  <Card className="summary-card">
                    <CardContent>
                      <Typography variant="subtitle2">Total Items</Typography>
                      <Typography variant="h4">
                        {reportData?.summary?.totalItems?.toLocaleString() || '0'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="summary-card">
                    <CardContent>
                      <Typography variant="subtitle2">Total Value</Typography>
                      <Typography variant="h4">
                        ${reportData?.summary?.totalValue?.toLocaleString() || '0'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="summary-card">
                    <CardContent>
                      <Typography variant="subtitle2">Low Stock Items</Typography>
                      <Typography variant="h4">
                        {reportData?.summary?.lowStockItems?.toLocaleString() || '0'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {renderAlerts()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReports;