'use client';

import React from 'react';

const DashboardClient = ({ user }: DashboardProps) => {
  return <>{user.fullname}</>;
};

export default DashboardClient;
