import React from 'react';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Reports = ({ cleanedFilename, charts, cleaningSummary }) => {
  if (!cleanedFilename) {
    return (
      <div className="text-center py-5">
        <p className="text-muted"><AssignmentTurnedInIcon className="me-2" fontSize="small" />No reports available. Upload a file first to generate reports.</p>
      </div>
    );
  }

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Data Analysis Report', 14, 22);
    
    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`File: ${cleanedFilename}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);
    
    let yPos = 45;
    
    // Data Cleaning Summary
    if (cleaningSummary) {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Data Cleaning Summary', 14, yPos);
      yPos += 8;
      
      const summaryData = [
        ['Total Rows', String(cleaningSummary.rows_after_cleaning || cleaningSummary.original_rows || 'N/A')],
        ['Duplicates Removed', String(cleaningSummary.duplicates_removed || 0)],
        ['Missing Values Filled', String((cleaningSummary.numeric_missing_filled || 0) + (cleaningSummary.categorical_missing_filled || 0))],
      ];
      
      if (cleaningSummary.outliers_capped && Object.keys(cleaningSummary.outliers_capped).length > 0) {
        const totalCapped = Object.values(cleaningSummary.outliers_capped).reduce((sum, col) => sum + (col.total_capped || 0), 0);
        summaryData.push(['Outliers Capped', `${totalCapped} values across ${Object.keys(cleaningSummary.outliers_capped).length} column(s)`]);
      }
      
      if (cleaningSummary.date_columns_converted && cleaningSummary.date_columns_converted.length > 0) {
        summaryData.push(['Date Columns Converted', cleaningSummary.date_columns_converted.join(', ')]);
      }
      
      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [13, 110, 253] },
        margin: { left: 14 },
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Visualizations info
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Visualizations', 14, yPos);
    yPos += 6;
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`${charts.length} chart(s) generated from your data`, 14, yPos);
    
    // Save PDF
    doc.save(`report_${cleanedFilename.replace(/\.[^/.]+$/, '')}_${Date.now()}.pdf`);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="glass-card hover-lift">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0 text-gradient d-flex align-items-center gap-2">
                <AssignmentIcon fontSize="small" />
                <span>Data Analysis Report</span>
              </h3>
              <button className="btn btn-gradient-primary btn-sm click-bounce" onClick={downloadReport}>
                <DownloadIcon className="me-1" fontSize="small" />Download Report
              </button>
            </div>

            <h6 className="text-muted">File: {cleanedFilename}</h6>

            {cleaningSummary && (
              <div className="mt-4">
                <h6 className="fw-bold">Data Cleaning Summary</h6>
                <ul className="list-group list-group-flush rounded-md-premium">
                  <li className="list-group-item">
                    <strong>Total Rows:</strong> {cleaningSummary.rows_after_cleaning || cleaningSummary.original_rows || 'N/A'}
                  </li>
                  <li className="list-group-item">
                    <strong>Duplicates Removed:</strong> {cleaningSummary.duplicates_removed || 0}
                  </li>
                  <li className="list-group-item">
                    <strong>Missing Values Filled:</strong> {(cleaningSummary.numeric_missing_filled || 0) + (cleaningSummary.categorical_missing_filled || 0)}
                  </li>
                  {cleaningSummary.outliers_capped && Object.keys(cleaningSummary.outliers_capped).length > 0 && (
                    <li className="list-group-item">
                      <strong>Outliers Capped:</strong> {Object.values(cleaningSummary.outliers_capped).reduce((sum, col) => sum + (col.total_capped || 0), 0)} values across {Object.keys(cleaningSummary.outliers_capped).length} column(s)
                    </li>
                  )}
                  {cleaningSummary.date_columns_converted && cleaningSummary.date_columns_converted.length > 0 && (
                    <li className="list-group-item">
                      <strong>Date Columns:</strong> {cleaningSummary.date_columns_converted.join(', ')}
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <h6 className="fw-bold">Visualizations Generated</h6>
              <p className="text-muted">{charts.length} chart(s) created from your data</p>
            </div>

            <div className="mt-4">
              <div className="glass-card d-flex align-items-center" role="alert" style={{ padding: '1rem' }}>
                <InfoIcon className="me-2" fontSize="small" />
                <div>
                  <strong>Tip:</strong> Use the "Ask AI" tab to chat with your data and generate custom insights!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
