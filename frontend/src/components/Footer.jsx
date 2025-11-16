import React from 'react';

const Footer = () => {
  return (
    <footer className="premium-footer">
      <div className="container d-flex flex-column flex-sm-row align-items-center justify-content-between">
        <div className="mb-2 mb-sm-0">
          <strong>No-Code Data Analyst</strong> · Premium UI
        </div>
        <div className="d-flex gap-3">
          <a href="#">Docs</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
