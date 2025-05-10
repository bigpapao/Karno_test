import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';

const BrandCard = ({ brand }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/brands/${brand.slug}`}
        sx={{ height: '100%' }}
      >
        <CardMedia
          component="img"
          height="140"
          image={brand.logo}
          alt={brand.name}
          sx={{
            objectFit: 'contain',
            bgcolor: 'background.paper',
            p: 2,
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h3" align="center">
            {brand.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 1,
            }}
          >
            <Chip
              label={`${brand.partsCount} Parts`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {brand.featured && (
              <Chip
                label="Featured"
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BrandCard;
