import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography 
} from '@mui/material';
import { 
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../../services/api';
import './SalesReports.css';

const SalesReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [breakdownBy, setBreakdownBy] = useState('category');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchReportData();
  }, [reportType, startDate, endDate, breakdownBy]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = {
        type: reportType,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        breakdown: breakdownBy
      };
      const response = await api.get('/reports/sales', { params });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
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
      case 'daily':
      case 'weekly':
      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'yearly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={reportData.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales ($)" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderBreakdown = () => {
    if (!reportData?.breakdown) return null;
    
    return (
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales by {breakdownBy === 'category' ? 'Category' : 'Product'}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportData.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Selling {breakdownBy === 'category' ? 'Categories' : 'Products'}
              </Typography>
              <div className="top-items">
                {reportData.breakdown
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="top-item">
                      <Typography variant="body1">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${item.value.toLocaleString()}
                      </Typography>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <div className="sales-reports">
      <div className="report-header">
        <Typography variant="h4">Sales Reports</Typography>
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
          <Button 
            variant="outlined" 
            startIcon={<EmailIcon />}
            onClick={() => handleExport('email')}
          >
            Email
          </Button>
        </div>
      </div>

      <Card className="report-controls">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Breakdown By</InputLabel>
                <Select
                  value={breakdownBy}
                  onChange={(e) => setBreakdownBy(e.target.value)}
                  label="Breakdown By"
                >
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="product">Product</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center">
                <DateRangeIcon sx={{ mr: 1 }} />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="date-picker"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center">
                <DateRangeIcon sx={{ mr: 1 }} />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="date-picker"
                />
              </Box>
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
                Sales Trend ({reportType})
              </Typography>
              {renderChart()}
              {renderBreakdown()}
              
              <Grid container spacing={3} mt={2}>
                <Grid item xs={12} md={4}>
                  <Card className="summary-card">
                    <CardContent>
                      <Typography variant="subtitle2">Total Sales</Typography>
                      <Typography variant="h4">
                        ${reportData?.summary?.totalSales?.toLocaleString() || '0'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="summary-card">
                    <CardContent>
                      <Typography variant="subtitle2">Total Orders</Typography>
                      <Typography variant="h4">
                        {reportData?.summary?.totalOrders?.toLocaleString() || '0'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="summary-card">
                    <CardContent>
                      <Typography variant="subtitle2">Avg. Order Value</Typography>
                      <Typography variant="h4">
                        ${reportData?.summary?.averageOrderValue?.toFixed(2) || '0.00'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReports;