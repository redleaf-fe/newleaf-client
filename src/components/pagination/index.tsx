import React from 'react';
import { Pagination } from 'redleaf-rc';

export default (props) => {
  return (
    <Pagination
      {...props}
      style={{ justifyContent: 'flex-end' }}
      renderTotalItems={({ totalItems }) => {
        return <span className="mr8">共{totalItems}项</span>;
      }}
    />
  );
};
