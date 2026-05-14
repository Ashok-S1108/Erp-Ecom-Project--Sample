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
  AttachMoney as MoneyIcon,
  TrendingUp as RevenueIcon,
  TrendingDown as ExpenseIcon
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
  ComposedChart,
  Area
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../../services/api';
import './FinancialReports.css';

const FinancialReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('profit-loss');
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchReportData();
  }, [reportType, period, startDate, endDate]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = {
        type: reportType,
        period,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      };
      const response = await api.get('/reports/financial', { params });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching financial report:', error);
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
      case 'profit-loss':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={reportData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="revenue" 
                fill="#82ca9d" 
                stroke="#82ca9d" 
                name="Revenue" 
              />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="expenses" 
                fill="#ffc658" 
                stroke="#ffc658" 
                name="Expenses" 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="profit" 
                stroke="#8884d8" 
                name="Profit" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      case 'cash-flow':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
              <Bar dataKey="inflow" fill="#82ca9d" name="Cash Inflow" />
              <Bar dataKey="outflow" fill="#ffc658" name="Cash Outflow" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'balance-sheet':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
              <Bar dataKey="assets" fill="#82ca9d" name="Assets" />
              <Bar dataKey="liabilities" fill="#ffc658" name="Liabilities" />
              <Bar dataKey="equity" fill="#8884d8" name="Equity" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderSummary = () => {
    if (!reportData?.summary) return null;

    return (
      <Grid container spacing={3} mt={2}>
        {reportType === 'profit-loss' && (
          <>
            <Grid item xs={12} md={4}>
              <Card className="summary-card revenue">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <RevenueIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Total Revenue</Typography>
                  </Box>
                  <Typography variant="h4">
                    ${reportData.summary.totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="summary-card expense">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ExpenseIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Total Expenses</Typography>
                  </Box>
                  <Typography variant="h4">
                    ${reportData.summary.totalExpenses.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="summary-card profit">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MoneyIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Net Profit</Typography>
                  </Box>
                  <Typography variant="h4">
                    ${reportData.summary.netProfit.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        {reportType === 'cash-flow' && (
          <>
            <Grid item xs={12} md={6}>
              <Card className="summary-card inflow">
                <CardContent>
                  <Typography variant="subtitle2">Total Cash Inflow</Typography>
                  <Typography variant="h4">
                    ${reportData.summary.totalInflow.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="summary-card outflow">
                <CardContent>
                  <Typography variant="subtitle2">Total Cash Outflow</Typography>
                  <Typography variant="h4">
                    ${reportData.summary.totalOutflow.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        {reportType === 'balance-sheet' && (
          <>
            <Grid item xs={12} md={4}>
              <Card className="summary-card assets">
                <CardContent>
                  <Typography variant="subtitle2">Total Assets</Typography>
                  <Typography variant="h4">
                    ${reportData.summary.totalAssets.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="summary-card liabilities">
                <CardContent>
                  <Typography variant="subtitle2">Total Liabilities</Typography>
                  <Typography variant="h4">
                    ${reportData.summary.totalLiabilities.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="summary-card equity">
                <CardContent>
                  <Typography variant="subtitle2">Total Equity</Typography>
                  <Typography variant="h4">
                    ${reportData.summary.totalEquity.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    );
  };

  return (
    <div className="financial-reports">
      <div className="report-header">
        <Typography variant="h4">Financial Reports</Typography>
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="profit-loss">Profit & Loss</MenuItem>
                  <MenuItem value="cash-flow">Cash Flow</MenuItem>
                  <MenuItem value="balance-sheet">Balance Sheet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={2}>
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
                {reportType === 'profit-loss' && 'Profit & Loss Statement'}
                {reportType === 'cash-flow' && 'Cash Flow Statement'}
                {reportType === 'balance-sheet' && 'Balance Sheet'}
              </Typography>
              {renderChart()}
              {renderSummary()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;