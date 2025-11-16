import React from 'react';

const HeaderBar = ({ title, subtitle, Icon }) => {
  return (
    <div className="premium-header-bar">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          {Icon ? <Icon style={{ color: 'white' }} /> : null}
          <h2 className="premium-header-title mb-0">{title}</h2>
        </div>
        {subtitle ? (
          <div style={{ opacity: 0.9 }}>{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderBar;
