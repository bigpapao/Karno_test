import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const defaultFilters = {
  priceRange: [0, 1000],
  brands: [],
  categories: [],
  availability: 'all',
  rating: 0,
  sortBy: 'relevance',
};

const FilterSidebar = ({
  open = false,
  onClose = () => {},
  filters = defaultFilters,
  onFilterChange = () => {},
  onClearFilters = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    priceRange = defaultFilters.priceRange,
    brands = defaultFilters.brands,
    categories = defaultFilters.categories,
    availability = defaultFilters.availability,
    rating = defaultFilters.rating,
    sortBy = defaultFilters.sortBy,
  } = filters || {};

  const handlePriceChange = (event, newValue) => {
    onFilterChange('priceRange', newValue);
  };

  const drawerContent = (
    <Box sx={{ width: 280, p: 3, direction: 'rtl' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6">فیلترها</Typography>
        {isMobile && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={onClearFilters}
        sx={{ mb: 3 }}
      >
        حذف همه فیلترها
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range */}
      <Typography variant="subtitle1" gutterBottom>
        محدوده قیمت
      </Typography>
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={10}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography variant="body2">{priceRange[0]} تومان</Typography>
          <Typography variant="body2">{priceRange[1]} تومان</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Brands */}
      <Typography variant="subtitle1" gutterBottom>
        برندها
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        {brands.map((brand) => (
          <FormControlLabel
            key={brand.id}
            control={
              <Checkbox
                checked={brand.checked}
                onChange={(e) =>
                  onFilterChange('brands', {
                    ...brand,
                    checked: e.target.checked,
                  })
                }
              />
            }
            label={`${brand.name} (${brand.count})`}
          />
        ))}
      </FormGroup>

      <Divider sx={{ mb: 3 }} />

      {/* Categories */}
      <Typography variant="subtitle1" gutterBottom>
        دسته‌بندی‌ها
      </Typography>
      <List dense sx={{ mb: 3 }}>
        {categories.map((category) => (
          <ListItem
            key={category.id}
            button
            selected={category.selected}
            onClick={() =>
              onFilterChange('categories', {
                ...category,
                selected: !category.selected,
              })
            }
          >
            <ListItemText
              primary={category.name}
              secondary={`${category.count} محصول`}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mb: 3 }} />

      {/* Availability */}
      <Typography variant="subtitle1" gutterBottom>
        موجودی
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={availability.inStock}
              onChange={(e) =>
                onFilterChange('availability', {
                  ...availability,
                  inStock: e.target.checked,
                })
              }
            />
          }
          label="موجود"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={availability.onSale}
              onChange={(e) =>
                onFilterChange('availability', {
                  ...availability,
                  onSale: e.target.checked,
                })
              }
            />
          }
          label="در حال فروش ویژه"
        />
      </FormGroup>

      <Divider sx={{ mb: 3 }} />

      {/* Rating */}
      <Typography variant="subtitle1" gutterBottom>
        امتیاز
      </Typography>
      <RadioGroup
        value={rating}
        onChange={(e) => onFilterChange('rating', e.target.value)}
        sx={{ mb: 3 }}
      >
        {[4, 3, 2, 1].map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={`${value}+ ستاره`}
          />
        ))}
      </RadioGroup>

      <Divider sx={{ mb: 3 }} />

      {/* Sort By */}
      <Typography variant="subtitle1" gutterBottom>
        مرتب‌سازی بر اساس
      </Typography>
      <RadioGroup
        value={sortBy}
        onChange={(e) => onFilterChange('sortBy', e.target.value)}
      >
        <FormControlLabel
          value="popular"
          control={<Radio />}
          label="محبوب‌ترین"
        />
        <FormControlLabel
          value="newest"
          control={<Radio />}
          label="جدیدترین"
        />
        <FormControlLabel
          value="priceAsc"
          control={<Radio />}
          label="قیمت: از کم به زیاد"
        />
        <FormControlLabel
          value="priceDesc"
          control={<Radio />}
          label="قیمت: از زیاد به کم"
        />
      </RadioGroup>
    </Box>
  );

  return isMobile ? (
    <Drawer anchor="right" open={open} onClose={onClose}>
      {drawerContent}
    </Drawer>
  ) : (
    <Box
      component="aside"
      sx={{
        width: 280,
        flexShrink: 0,
        borderLeft: 1,
        borderColor: 'divider',
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default FilterSidebar;
