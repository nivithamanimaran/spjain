import React from 'react';
import KenTabs from '../../../../components/KenTabs';
import SummaryStudent from './components/Summary';
import SOP from './components/SOP';
import { useEffect } from 'react';

export default function StudentDetails({ drawerChanges }) {

  useEffect(() => {
    drawerChanges('hide');
  }, []);

  const data = [
    {
      title: 'Summary',
      content: <SummaryStudent />,
    },
    {
      title: 'SOP',
      content: <SOP />,
    },
  ];
  return (
    <div>
      <KenTabs data={data} />
    </div>
  );
}
