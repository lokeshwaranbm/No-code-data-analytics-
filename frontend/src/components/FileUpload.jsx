import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onUpload, loading }) => {
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setError(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setError('Unsupported file type. Please select a .csv or .xlsx file.');
      return;
    }
    if (onUpload) onUpload(file);
    e.target.value = '';
  };

  return (
    <Card variant="outlined" className="glass-card hover-lift">
      <CardContent>
        <Typography variant="h6" gutterBottom className="text-gradient">Upload CSV or XLSX</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Button
            variant="contained"
            component="label"
            className="btn-gradient-primary click-bounce"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {loading ? 'Uploading…' : 'Choose File'}
            <input hidden type="file" accept=".csv,.xlsx,.xls" onChange={handleChange} />
          </Button>
          <Typography variant="body2" color="text.secondary">
            Supported: .csv, .xlsx, .xls
          </Typography>
        </Stack>
        {error && <Alert sx={{ mt: 2 }} severity="error" className="glass-card">{error}</Alert>}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
