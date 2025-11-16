import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Stack from '@mui/material/Stack';

const InsightsCard = ({ insights }) => {
  const items = Array.isArray(insights) ? insights : (insights ? [insights] : []);
  return (
    <Card variant="outlined" sx={{ my: 2 }} className="glass-card hover-lift">
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <InfoOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="h6" className="text-gradient">AI Insights</Typography>
        </Stack>
        {items.length ? (
          <List dense disablePadding>
            {items.map((ins, idx) => (
              <ListItem key={idx} disableGutters>
                <ListItemText primary={ins} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">No insights yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsCard;
