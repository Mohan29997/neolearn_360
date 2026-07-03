import { Fragment } from 'react';
import {
  Box, Typography, Avatar, Chip, Button, Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, IconButton, InputBase,
} from '@mui/material';
import {
  FilterListRounded, FlashOnRounded, BuildRounded,
  MenuBookRounded, CloseRounded, SearchRounded, CheckCircleRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TabTitle from '../../../components/tabtitle';
import { useBench } from '../../../features/bench/hooks/useBench';
import { BENCH_STATUS_CONFIG, ACCENT_COLORS, BRAND, SURFACE } from '../../../constants/brand.constants';
import type { BenchDisplayStatus } from '../../../types/common.types';
import BenchStatCard from './BenchStatCard';
import { benchStyles as bs } from './BenchOnboarding.styles';
import { TECH_STACK_OPTIONS } from './BenchOnboarding.constants';

const BenchOnboardingPage = () => {
  const navigate = useNavigate();
  const {
    loading, isManager, isLND, grouped, filtered, departments,
    totalCount, onBenchCount, shadowingCount, onProjectCount,
    deptFilter, statusFilter, techFilter, page,
    assignTarget, selectedMentor, mentorSearch, preAssessmentScore,
    allUsers, assigning,
    detailTarget, setDetailTarget,
    setPage, setDeptFilter, setStatusFilter, setTechFilter,
    setSelectedMentor, setMentorSearch, setPreAssessmentScore,
    handleStatusChange, openAssign, closeAssign, handleAssign,
  } = useBench();

  return (
    <Fragment>
      <TabTitle title="Team Management" />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'grey.900' }}>Team Management</Typography>
          <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>Track and manage resources currently between projects.</Typography>
        </Box>

        <Box sx={bs.statsRow}>
          <BenchStatCard label="TOTAL EMPLOYEES" value={String(totalCount)} sub="All members" accent={BRAND.redDeep} />
          <BenchStatCard label="ON BENCH" value={String(onBenchCount)} sub="Awaiting project" accent={ACCENT_COLORS.blue} />
          <BenchStatCard label="SHADOWING" value={String(shadowingCount)} sub="Billable Ready" accent={ACCENT_COLORS.amber} />
          <BenchStatCard label="ON PROJECT" value={String(onProjectCount)} sub="Active" accent={ACCENT_COLORS.green} />
        </Box>

        <Box sx={bs.tableWrapper}>
          <Box sx={bs.filterRow}>
            {!isManager && (
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select displayEmpty value={deptFilter}
                  onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
                  startAdornment={<FilterListRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                  sx={bs.filterSelect} renderValue={v => (v as string) || 'All Departments'}>
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            )}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select displayEmpty value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                startAdornment={<FlashOnRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                sx={bs.filterSelect} renderValue={v => (v as string) ? `Status: ${v}` : 'Status: All'}>
                <MenuItem value="">All</MenuItem>
                {Object.keys(BENCH_STATUS_CONFIG).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select displayEmpty value={techFilter}
                onChange={e => { setTechFilter(e.target.value); setPage(1); }}
                startAdornment={<BuildRounded sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />}
                sx={bs.filterSelect} renderValue={v => (v as string) ? `Tech: ${v}` : 'Tech Stack: All'}>
                <MenuItem value="">All</MenuItem>
                {TECH_STACK_OPTIONS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography sx={bs.filterCount}>Showing {filtered.length} employee{filtered.length !== 1 ? 's' : ''}</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={bs.tableHeadRow}>
                  {['EMPLOYEE NAME', 'EMPLOYEE ID', 'DEPARTMENT', 'ROLE', 'LOCATION', isLND ? 'HEAD COUNT' : 'STATUS', 'ACTIONS'].map(h => (
                    <TableCell key={h} sx={bs.tableHeadCell}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: 'grey.400', fontSize: 13 }}>No employees found.</TableCell></TableRow>
                ) : grouped.map(({ subDept, members }) => (
                  <Fragment key={subDept}>
                    {/* Sub-department header row */}
                    <TableRow>
                      <TableCell colSpan={7} sx={bs.subDeptHeaderCell}>
                        <Box sx={bs.subDeptHeaderInner}>
                          <Typography sx={bs.subDeptHeaderText}>{subDept}</Typography>
                          <Chip label={`${members.length} member${members.length !== 1 ? 's' : ''}`} size="small" sx={bs.subDeptCountChip} />
                        </Box>
                      </TableCell>
                    </TableRow>
                    {members.map(emp => {
                      const sc = BENCH_STATUS_CONFIG[emp.status] ?? BENCH_STATUS_CONFIG['On Bench'];
                      const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                      const isOnBench = emp.status === 'On Bench';
                      return (
                        <TableRow key={emp._id} hover sx={bs.tableRow}>
                          <TableCell sx={bs.empCell}>
                            <Box sx={bs.empInner}>
                              <Avatar sx={bs.empAvatar}>{initials}</Avatar>
                              <Box>
                                <Typography sx={{ ...bs.empName, cursor: 'pointer', '&:hover': { color: BRAND.red, textDecoration: 'underline' } }}
                                  onClick={() => setDetailTarget(emp)}>{emp.name}</Typography>
                                <Typography sx={bs.empEmail}>{emp.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell><Typography sx={bs.empId}>{emp.employeeId}</Typography></TableCell>
                          <TableCell><Chip label={emp.department} size="small" sx={bs.deptChip} /></TableCell>
                          <TableCell><Chip label={emp.role || 'User'} size="small" sx={{ fontSize: 11, fontWeight: 700, bgcolor: BRAND.redBg, color: BRAND.red, border: `1px solid ${BRAND.redBorder}`, borderRadius: '6px' }} /></TableCell>
                          <TableCell><Typography sx={bs.textMuted}>{emp.officeLocation}</Typography></TableCell>
                          <TableCell>
                            {isLND ? (
                              <Typography sx={{ fontSize: 13, color: 'grey.700', fontWeight: 600 }}>1</Typography>
                            ) : (
                              <Select size="small" value={emp.status}
                                onChange={e => handleStatusChange(emp._id, e.target.value as BenchDisplayStatus)}
                                sx={bs.selectSx(sc.color, sc.bg)}>
                                {Object.keys(BENCH_STATUS_CONFIG).map(s => (
                                  <MenuItem key={s} value={s} sx={{ fontSize: 12, fontWeight: 500 }}>{s}</MenuItem>
                                ))}
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {isOnBench && (() => {
                              if (emp.courseStarted) return <Button size="small" sx={bs.courseStartedBtn}>Course Started</Button>;
                              if (emp.courseAssigned !== null) return (
                                <Button size="small" startIcon={<CheckCircleRounded sx={{ fontSize: 15 }} />}
                                  onClick={() => navigate('/admin/courses')} sx={bs.courseAssignedBtn}>
                                  Course Assigned
                                </Button>
                              );
                              return (
                                <Button size="small" startIcon={<MenuBookRounded sx={{ fontSize: 15 }} />}
                                  onClick={() => openAssign(emp)} sx={bs.assignCourseBtn}>
                                  Assign Course
                                </Button>
                              );
                            })()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      </Box>

      <Modal open={!!assignTarget} onClose={closeAssign}>
        <Box sx={bs.assignModal}>
          <Box sx={bs.assignModalHeader}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Assign Course</Typography>
            <IconButton size="small" onClick={closeAssign}><CloseRounded /></IconButton>
          </Box>
          {assignTarget && (
            <Box sx={bs.assignTargetBox}>
              <Avatar sx={bs.assignTargetAvatar}>
                {assignTarget.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'grey.900' }}>{assignTarget.name}</Typography>
                <Typography sx={{ fontSize: 12, color: 'grey.500' }}>{assignTarget.employeeId} · {assignTarget.department}</Typography>
              </Box>
            </Box>
          )}
          <Typography sx={bs.fieldLabel}>Mentor Name</Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <Select displayEmpty value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)}
              renderValue={v => { const u = allUsers.find(x => x._id === v); return u ? u.name : <Typography sx={{ color: 'grey.400', fontSize: 13 }}>Select a mentor...</Typography>; }}
              sx={{ fontSize: 13, borderRadius: '8px' }}
              MenuProps={{ autoFocus: false, slotProps: { paper: { sx: { maxHeight: 320 } }, list: { sx: { pt: 0, overflowY: 'auto' } } } }}
              onClose={() => setMentorSearch('')}>
              <Box sx={bs.searchDropdown} onKeyDown={e => e.stopPropagation()}>
                <Box sx={bs.searchInnerBox}>
                  <SearchRounded sx={{ fontSize: 15, color: 'grey.400', flexShrink: 0 }} />
                  <InputBase autoFocus fullWidth placeholder="Search mentors..." value={mentorSearch} onChange={e => setMentorSearch(e.target.value)} sx={{ fontSize: '13px' }} />
                </Box>
              </Box>
              {allUsers.filter(u => u.name.toLowerCase().includes(mentorSearch.toLowerCase())).map(u => (
                <MenuItem key={u._id} value={u._id}>
                  <Box><Typography sx={bs.menuItemName}>{u.name}</Typography><Typography sx={bs.menuItemSub}>{u.role}{u.department ? ` · ${u.department}` : ''}</Typography></Box>
                </MenuItem>
              ))}
              {allUsers.filter(u => u.name.toLowerCase().includes(mentorSearch.toLowerCase())).length === 0 && (
                <Typography sx={bs.emptyMenuText}>No mentors found</Typography>
              )}
            </Select>
          </FormControl>
          <Typography sx={bs.fieldLabel}>Pre-Assessment Score (out of 100)</Typography>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'grey.300', borderRadius: '8px', px: 1.5, py: 0.8 }}>
            <InputBase fullWidth type="number" placeholder="Enter score (0 - 100)" value={preAssessmentScore}
              onChange={e => {
                const val = e.target.value;
                if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) setPreAssessmentScore(val);
              }}
              inputProps={{ min: 0, max: 100 }} sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: 12, color: 'grey.400', whiteSpace: 'nowrap' }}>/ 100</Typography>
          </Box>
          <Box sx={bs.assignActions}>
            <Button onClick={closeAssign} sx={bs.cancelBtn}>Cancel</Button>
            <Button variant="contained" disabled={!selectedMentor || assigning} onClick={handleAssign} sx={bs.assignBtn}>
              Assign
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Employee Detail Modal */}
      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)}>
        <Box sx={bs.detailModal}>
          {detailTarget && (() => {
            const d = detailTarget;
            const sc = BENCH_STATUS_CONFIG[d.status] ?? BENCH_STATUS_CONFIG['On Bench'];
            const infoFields: [string, string][] = [
              ['Employee ID', d.employeeId],
              ['Email', d.email],
              ['Role', d.role || 'User'],
              ['Department', d.department],
              ...(d.subDepartmentName ? [['Sub-Department', d.subDepartmentName] as [string, string]] : []),
              ['Manager', d.managerName],
              ...(d.vpName ? [['VP', d.vpName] as [string, string]] : []),
              ...(d.tlName ? [['TL', d.tlName] as [string, string]] : []),
              ['Location', d.officeLocation],
            ];
            return (
              <>
                {/* Header */}
                <Box sx={bs.detailHeader}>
                  <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'grey.900' }}>Employee Details</Typography>
                  <IconButton size="small" onClick={() => setDetailTarget(null)} sx={{ color: 'grey.500' }}><CloseRounded fontSize="small" /></IconButton>
                </Box>

                {/* Profile Banner */}
                <Box sx={bs.detailBanner}>
                  <Avatar sx={bs.detailAvatar}>
                    {d.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: 'grey.900', lineHeight: 1.3 }}>{d.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'grey.500', mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      <Chip label={d.status} size="small" sx={{ fontSize: 11, fontWeight: 700, bgcolor: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }} />
                      <Chip label={d.role || 'User'} size="small" sx={{ fontSize: 11, fontWeight: 700, bgcolor: BRAND.redBg, color: BRAND.red, border: `1px solid ${BRAND.redBorder}` }} />
                      {d.isActive && <Chip label="Active" size="small" sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }} />}
                    </Box>
                  </Box>
                </Box>

                {/* Info Grid */}
                <Box sx={bs.detailGrid}>
                  {infoFields.map(([label, value]) => (
                    <Box key={label} sx={bs.detailField}>
                      <Typography sx={bs.detailFieldLabel}>{label}</Typography>
                      <Typography sx={bs.detailFieldValue}>{value}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Technologies */}
                {d.techStack.length > 0 && (
                  <Box sx={bs.detailTechBox}>
                    <Typography sx={bs.detailFieldLabel}>Technologies</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
                      {d.techStack.map(t => (
                        <Chip key={t} label={t} size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: SURFACE.muted, color: 'grey.700', border: `1px solid ${SURFACE.border}` }} />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Course Status */}
                <Box sx={bs.detailCourseRow}>
                  <Box sx={bs.detailCourseBox(d.courseAssigned !== null)}>
                    <Typography sx={bs.detailFieldLabel}>Course Assigned</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: d.courseAssigned !== null ? '#16A34A' : 'grey.400', mt: 0.3 }}>
                      {d.courseAssigned !== null ? 'Yes' : 'Not Yet'}
                    </Typography>
                  </Box>
                  <Box sx={bs.detailCourseBox(d.courseStarted)}>
                    <Typography sx={bs.detailFieldLabel}>Course Started</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: d.courseStarted ? '#2563EB' : 'grey.400', mt: 0.3 }}>
                      {d.courseStarted ? 'Yes' : 'Not Yet'}
                    </Typography>
                  </Box>
                </Box>
              </>
            );
          })()}
        </Box>
      </Modal>
    </Fragment>
  );
};

export default BenchOnboardingPage;
