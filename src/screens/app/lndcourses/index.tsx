import React, { Fragment, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  TablePagination
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useStyle } from './style';

// Initial mock data to populate the table
const initialCourses = [
  {
    id: 1,
    department: 'Engineering',
    technology: 'React',
    lpDetails: 'Advanced React Architecture',
    hours: 40,
    days: 5
  },
  {
    id: 2,
    department: 'Data Science',
    technology: 'Python',
    lpDetails: 'AI/ML Fundamentals',
    hours: 60,
    days: 10
  },
  {
    id: 3,
    department: 'Engineering',
    technology: 'Node.js',
    lpDetails: 'Backend API Development',
    hours: 45,
    days: 6
  },
  {
    id: 4,
    department: 'Engineering',
    technology: 'Angular',
    lpDetails: 'Enterprise Angular Applications',
    hours: 50,
    days: 7
  },
  {
    id: 5,
    department: 'Engineering',
    technology: 'React Native',
    lpDetails: 'Cross-Platform Mobile Development',
    hours: 55,
    days: 8
  },
  {
    id: 6,
    department: 'Data Science',
    technology: 'TensorFlow',
    lpDetails: 'Deep Learning Essentials',
    hours: 70,
    days: 12
  },
  {
    id: 7,
    department: 'Data Science',
    technology: 'Power BI',
    lpDetails: 'Data Visualization & Reporting',
    hours: 35,
    days: 5
  },
  {
    id: 8,
    department: 'Cloud',
    technology: 'AWS',
    lpDetails: 'AWS Solutions Architect',
    hours: 80,
    days: 15
  },
  {
    id: 9,
    department: 'Cloud',
    technology: 'Azure',
    lpDetails: 'Azure Cloud Administration',
    hours: 75,
    days: 14
  },
  {
    id: 10,
    department: 'DevOps',
    technology: 'Docker',
    lpDetails: 'Containerization Fundamentals',
    hours: 30,
    days: 4
  },
  {
    id: 11,
    department: 'DevOps',
    technology: 'Kubernetes',
    lpDetails: 'Container Orchestration',
    hours: 65,
    days: 10
  },
  {
    id: 12,
    department: 'Database',
    technology: 'MongoDB',
    lpDetails: 'NoSQL Database Design',
    hours: 40,
    days: 6
  },
  {
    id: 13,
    department: 'Database',
    technology: 'PostgreSQL',
    lpDetails: 'Advanced SQL & Performance Tuning',
    hours: 50,
    days: 8
  },
  {
    id: 14,
    department: 'Security',
    technology: 'Cybersecurity',
    lpDetails: 'Application Security Best Practices',
    hours: 60,
    days: 10
  },
  {
    id: 15,
    department: 'QA',
    technology: 'Selenium',
    lpDetails: 'Automated Testing Frameworks',
    hours: 45,
    days: 7
  }
];

const departments = [
  'Engineering',
  'Data Science',
  'Sales',
  'Marketing',
  'HR',
  'IT Ops'
];

const LndCourses = () => {
  const styles = useStyle();

  const [courses, setCourses] = useState(initialCourses);

  // Form state
  const [department, setDepartment] = useState('');
  const [technology, setTechnology] = useState('');
  const [lpDetails, setLpDetails] = useState('');
  const [hours, setHours] = useState('');
  const [days, setDays] = useState('');
  const [courseLink, setCourseLink] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !technology || !lpDetails || !hours || !days || !courseLink) return;

    const newCourse = {
      id: Date.now(),
      department,
      technology,
      lpDetails,
      hours: Number(hours),
      days: Number(days),
      courseLink,
    };

    setCourses([...courses, newCourse]);

    // Reset form
    setDepartment('');
    setTechnology('');
    setLpDetails('');
    setHours('');
    setDays('');
    setCourseLink('');
  };

  return (
    <Fragment>
      <Box sx={styles.container}>

        {/* Header Section */}
        <Box sx={styles.headerContainer}>
          <Box sx={styles.headerTextContainer}>
            <Typography variant="h4" sx={styles.headerTitle}>
              L&D Course Management
            </Typography>
            <Typography variant="body1" sx={styles.headerSubtitle}>
              Create and manage learning programs and technologies by department
            </Typography>
          </Box>
        </Box>

        {/* Course Creation Form */}
        <Card sx={styles.formCard}>
          <CardContent>
            <Typography variant="h6" sx={styles.formHeaderTitle}>
              Add New Course
            </Typography>
            <form onSubmit={handleAddCourse}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    select
                    fullWidth
                    label="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    sx={styles.inputField}
                    required
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Technology"
                    placeholder="e.g. React, Python"
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                    sx={styles.inputField}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="LP - Learning Program"
                    placeholder="Course Title / Details"
                    value={lpDetails}
                    onChange={(e) => setLpDetails(e.target.value)}
                    sx={styles.inputField}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Time Duration (Hours)"
                    placeholder="e.g. 40"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    sx={styles.inputField}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Time Duration (Days)"
                    placeholder="e.g. 5"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    sx={styles.inputField}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Course link"
                    placeholder="e.g. https://udemy.com/course-url-here"
                    value={courseLink}
                    onChange={(e) => setCourseLink(e.target.value)}
                    sx={styles.inputField}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={styles.submitButton}
                    fullWidth
                  >
                    Add Course
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Course List Table */}
        <Card sx={styles.tableCard}>
          <Box sx={styles.tableHeader}>
            <Typography variant="h6" sx={styles.tableHeaderTitle}>
              Course List
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  <TableCell sx={styles.tableCellHeader}>DEPARTMENT</TableCell>
                  <TableCell sx={styles.tableCellHeader}>TECHNOLOGY</TableCell>
                  <TableCell sx={styles.tableCellHeader}>LEARNING PROGRAM</TableCell>
                  <TableCell sx={styles.tableCellHeader}>DURATION (HOURS)</TableCell>
                  <TableCell sx={styles.tableCellHeader}>DURATION (DAYS)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" sx={styles.tableTextBase}>
                        No courses found. Add a new course above.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  courses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((course) => (
                      <TableRow key={course.id} sx={styles.tableRow}>
                        <TableCell>
                          <Typography variant="body2" sx={styles.tableTextPrimary}>
                            {course.department}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={styles.tableTextBase}>
                            {course.technology}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={styles.tableTextBase}>
                            {course.lpDetails}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={styles.tableTextBase}>
                            {course.hours} hrs
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={styles.tableTextBase}>
                            {course.days} days
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={courses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Box>
    </Fragment>
  );
};

export default LndCourses;
