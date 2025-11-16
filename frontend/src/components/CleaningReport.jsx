import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const CleaningReport = ({ summary }) => {
  if (!summary) {
    return (
      <Card variant="outlined" sx={{ my: 2 }} className="glass-card hover-lift">
        <CardContent>
          <Typography variant="h6" className="text-gradient">Cleaning Report</Typography>
          <Typography variant="body2" color="text.secondary">No cleaning performed yet.</Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card variant="outlined" sx={{ my: 2 }} className="glass-card hover-lift">
      <CardContent>
        <Typography variant="h6" gutterBottom className="text-gradient">Cleaning Report</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>{summary.summary_text}</Typography>
        <List dense disablePadding>
          <ListItem disableGutters>
            <ListItemText primary={`Original rows: ${summary.original_rows}`} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary={`Rows after cleaning: ${summary.rows_after_cleaning}`} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary={`Duplicates removed: ${summary.duplicates_removed}`} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary={`Numeric missing filled: ${summary.numeric_missing_filled}`} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary={`Categorical missing filled: ${summary.categorical_missing_filled}`} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary={`Date columns converted: ${summary.date_columns_converted?.length || 0}`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default CleaningReport;