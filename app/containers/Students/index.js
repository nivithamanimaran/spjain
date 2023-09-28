import React from 'react';
import { Box } from '@material-ui/core';
const StudentTable = React.lazy(() => import('../StudentsPage/components/StudentTable'));

export default function Students(props) {
  props.setHeading("My Students")

  const { drawerChanges } = props;

  React.useEffect(() => {
    drawerChanges('show');
  }, []);
  return (
    <Box>
      <Box mt={2}>
        <StudentTable />
      </Box>
    </Box>
  );
}
