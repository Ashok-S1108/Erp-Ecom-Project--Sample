import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const ProductFilters = ({ filters, onFilterChange, categories }) => {
  const handleFilterChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handlePriceChange = (event, newValue) => {
    handleFilterChange('priceRange', newValue);
  };

  const handleCategoryChange = (event) => {
    handleFilterChange('category', event.target.value);
  };

  const handleStockChange = (event) => {
    handleFilterChange('inStock', event.target.checked);
  };

  const handleFeaturedChange = (event) => {
    handleFilterChange('featured', event.target.checked);
  };

  const handleRemoveCategory = () => {
    handleFilterChange('category', '');
  };

  const handleRemoveStockFilter = () => {
    handleFilterChange('inStock', false);
  };

  const handleRemoveFeaturedFilter = () => {
    handleFilterChange('featured', false);
  };

  const priceMarks = [
    { value: 0, label: '$0' },
    { value: 1000, label: '$1000' },
    { value: 2000, label: '$2000' },
    { value: 3000, label: '$3000' }
  ];

  return (
    <Box className="product-filters">
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {/* Active Filters */}
      {(filters.category || filters.inStock || filters.featured) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.category && (
              <Chip
                label={`Category: ${categories.find(c => c._id === filters.category)?.name}`}
                onDelete={handleRemoveCategory}
                size="small"
              />
            )}
            {filters.inStock && (
              <Chip
                label="In Stock"
                onDelete={handleRemoveStockFilter}
                size="small"
              />
            )}
            {filters.featured && (
              <Chip
                label="Featured"
                onDelete={handleRemoveFeaturedFilter}
                size="small"
              />
            )}
          </Box>
        </Box>
      )}

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={3000}
            valueLabelFormat={(value) => `$${value}`}
            marks={priceMarks}
          />
          <Box className="price-labels" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">${filters.priceRange[0]}</Typography>
            <Typography variant="body2">${filters.priceRange[1]}</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={filters.category} onChange={handleCategoryChange}>
              <FormControlLabel value="" control={<Radio />} label="All Categories" />
              {categories.map((category) => (
                <FormControlLabel
                  key={category._id}
                  value={category._id}
                  control={<Radio />}
                  label={category.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Availability</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.inStock}
                  onChange={handleStockChange}
                />
              }
              label="In Stock Only"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.featured}
                  onChange={handleFeaturedChange}
                />
              }
              label="Featured Products"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ProductFilters;