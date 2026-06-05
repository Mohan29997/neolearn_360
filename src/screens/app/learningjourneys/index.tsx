import { Fragment, useState } from 'react';
import {
    Box, Typography, Chip, LinearProgress,
    Dialog, DialogTitle, DialogContent, IconButton,
    Divider, List, ListItem, ListItemText, Tooltip,
} from '@mui/material';
import {
    ChevronRightRounded, CloseRounded, OpenInNewRounded,
    CheckCircleRounded, RadioButtonUncheckedRounded, AddCircleRounded, RemoveCircleRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';

const BRAND_RED = '#8B1A2E';

interface Course {
    id: string;
    title: string;
    description: string;
    link: string;
    duration: string;
    completed: boolean;
}

interface Journey {
    _id: string;
    track: string;
    title: string;
    description: string;
    progress: number;
    courses: number;
    completedCourses: number;
    duration: string;
    level: string;
    courseList: Course[];
}

const MOCK_JOURNEYS: Journey[] = [
    {
        _id: '1',
        track: 'ENTERPRISE TRACK',
        title: 'Full-Stack Development Boot Camp',
        description: 'A comprehensive path covering modern frontend architectures, backend systems, and cloud-native deployment strategies for senior engineering teams.',
        progress: 64,
        courses: 8,
        completedCourses: 5,
        duration: '48h',
        level: 'Advanced',
        courseList: [
            { id: 'c1', title: 'Modern JavaScript & TypeScript', description: 'Deep dive into ES2023+ features, type systems, and advanced TypeScript patterns used in enterprise codebases.', link: 'https://www.udemy.com/course/understanding-typescript/', duration: '8h', completed: true },
            { id: 'c2', title: 'React Architecture Patterns', description: 'Component design, state management strategies, and performance optimization for large-scale React applications.', link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', duration: '6h', completed: true },
            { id: 'c3', title: 'Node.js & REST API Design', description: 'Building robust and scalable REST APIs with Node.js, Express, and best practices for authentication and error handling.', link: 'https://www.udemy.com/course/nodejs-the-complete-guide/', duration: '7h', completed: true },
            { id: 'c4', title: 'PostgreSQL & Database Design', description: 'Relational database modeling, query optimization, indexing strategies and migrations with PostgreSQL.', link: 'https://www.udemy.com/course/sql-and-postgresql/', duration: '5h', completed: true },
            { id: 'c5', title: 'GraphQL APIs', description: 'Design and consume GraphQL APIs — schemas, resolvers, subscriptions, and integrating with React via Apollo Client.', link: 'https://www.udemy.com/course/graphql-with-react-course/', duration: '5h', completed: true },
            { id: 'c6', title: 'Docker & Containerization', description: 'Containerizing applications with Docker, writing Dockerfiles, multi-stage builds, and docker-compose for local development.', link: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', duration: '6h', completed: false },
            { id: 'c7', title: 'CI/CD with GitHub Actions', description: 'Automating build, test, and deployment pipelines with GitHub Actions for full-stack applications.', link: 'https://www.udemy.com/course/github-actions-the-complete-guide/', duration: '5h', completed: false },
            { id: 'c8', title: 'Cloud Deployment on AWS', description: 'Deploying full-stack apps to AWS using EC2, S3, RDS, and CloudFront with infrastructure as code basics.', link: 'https://www.udemy.com/course/aws-certified-developer-associate/', duration: '6h', completed: false },
        ],
    },
    {
        _id: '2',
        track: 'LEADERSHIP TRACK',
        title: 'Engineering Management Essentials',
        description: 'Build skills in team leadership, technical roadmap planning, and stakeholder communication for engineering leads transitioning into management.',
        progress: 32,
        courses: 6,
        completedCourses: 2,
        duration: '36h',
        level: 'Intermediate',
        courseList: [
            { id: 'c1', title: 'Engineering Leadership Fundamentals', description: 'Transitioning from IC to manager — setting expectations, building trust, and running effective 1:1s.', link: 'https://www.linkedin.com/learning/engineering-leadership', duration: '6h', completed: true },
            { id: 'c2', title: 'Technical Roadmap Planning', description: 'How to align engineering priorities with business goals, manage technical debt, and communicate roadmaps to stakeholders.', link: 'https://www.coursera.org/learn/product-management', duration: '6h', completed: true },
            { id: 'c3', title: 'Hiring & Team Building', description: 'Structured interviews, building diverse teams, and onboarding strategies that ramp engineers quickly.', link: 'https://www.udemy.com/course/hiring-and-building-great-teams/', duration: '6h', completed: false },
            { id: 'c4', title: 'Stakeholder Communication', description: 'Presenting technical concepts to non-technical audiences, managing up, and running productive sprint reviews.', link: 'https://www.coursera.org/learn/communication-for-engineers', duration: '6h', completed: false },
            { id: 'c5', title: 'Performance Management & Feedback', description: 'Delivering constructive feedback, conducting performance reviews, and helping engineers grow in their careers.', link: 'https://www.linkedin.com/learning/giving-and-receiving-feedback', duration: '6h', completed: false },
            { id: 'c6', title: 'Incident Management & On-call Culture', description: 'Building resilient on-call rotations, running effective postmortems, and fostering a blame-free culture.', link: 'https://www.udemy.com/course/site-reliability-engineering/', duration: '6h', completed: false },
        ],
    },
    {
        _id: '3',
        track: 'CLOUD TRACK',
        title: 'AWS Solutions Architect Path',
        description: 'End-to-end preparation for AWS architecture certification covering core services, security, cost optimization, and high-availability design.',
        progress: 88,
        courses: 10,
        completedCourses: 9,
        duration: '60h',
        level: 'Advanced',
        courseList: [
            { id: 'c1', title: 'AWS Core Services Overview', description: 'IAM, EC2, S3, VPC, and RDS fundamentals — the building blocks of every AWS architecture.', link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', duration: '6h', completed: true },
            { id: 'c2', title: 'VPC & Networking Deep Dive', description: 'Subnets, routing tables, NAT gateways, VPN, and Direct Connect for enterprise network design.', link: 'https://www.udemy.com/course/aws-vpc-and-networking/', duration: '5h', completed: true },
            { id: 'c3', title: 'AWS Security & IAM', description: 'Least-privilege policies, SCPs, AWS Organizations, KMS encryption, and CloudTrail auditing.', link: 'https://www.udemy.com/course/aws-security-specialty/', duration: '6h', completed: true },
            { id: 'c4', title: 'High Availability & Fault Tolerance', description: 'Multi-AZ deployments, Auto Scaling, ELB, and Route 53 failover for resilient architectures.', link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', duration: '7h', completed: true },
            { id: 'c5', title: 'Serverless with Lambda & API Gateway', description: 'Event-driven architectures using Lambda, API Gateway, DynamoDB, and Step Functions.', link: 'https://www.udemy.com/course/aws-lambda-serverless/', duration: '5h', completed: true },
            { id: 'c6', title: 'AWS Storage Solutions', description: 'S3 lifecycle policies, EBS volumes, EFS, Glacier, and Storage Gateway for hybrid architectures.', link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', duration: '5h', completed: true },
            { id: 'c7', title: 'Databases on AWS', description: 'RDS Multi-AZ, Aurora, DynamoDB, ElastiCache, and choosing the right database for your workload.', link: 'https://www.udemy.com/course/aws-databases/', duration: '6h', completed: true },
            { id: 'c8', title: 'AWS Cost Optimization', description: 'Reserved instances, Savings Plans, Compute Optimizer, and tagging strategies to manage cloud spend.', link: 'https://www.udemy.com/course/aws-cost-management/', duration: '4h', completed: true },
            { id: 'c9', title: 'Infrastructure as Code with CloudFormation', description: 'Writing, deploying, and managing CloudFormation stacks and StackSets for repeatable infrastructure.', link: 'https://www.udemy.com/course/aws-cloudformation-master-class/', duration: '6h', completed: true },
            { id: 'c10', title: 'SAA-C03 Exam Prep & Practice Tests', description: 'Full-length mock exams, review of weak areas, and exam-day strategies for AWS Solutions Architect Associate.', link: 'https://www.udemy.com/course/practice-exams-aws-certified-solutions-architect-associate/', duration: '4h', completed: false },
        ],
    },
    {
        _id: '4',
        track: 'FUNDAMENTALS TRACK',
        title: 'Data Science & ML Foundations',
        description: 'Structured learning path for engineers stepping into data roles — covering statistics, Python, ML algorithms, and model deployment.',
        progress: 18,
        courses: 7,
        completedCourses: 1,
        duration: '42h',
        level: 'Beginner',
        courseList: [
            { id: 'c1', title: 'Python for Data Science', description: 'NumPy, Pandas, and Matplotlib essentials for data manipulation, analysis, and visualization.', link: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/', duration: '6h', completed: true },
            { id: 'c2', title: 'Statistics & Probability for ML', description: 'Descriptive stats, probability distributions, hypothesis testing, and Bayesian thinking applied to ML.', link: 'https://www.coursera.org/learn/stanford-statistics', duration: '6h', completed: false },
            { id: 'c3', title: 'Machine Learning with Scikit-Learn', description: 'Supervised and unsupervised learning algorithms — regression, classification, clustering, and model evaluation.', link: 'https://www.udemy.com/course/machine-learning-course-with-python/', duration: '7h', completed: false },
            { id: 'c4', title: 'Data Visualization & Storytelling', description: 'Creating impactful charts with Matplotlib, Seaborn, and Plotly — and communicating findings to business stakeholders.', link: 'https://www.udemy.com/course/data-visualization-with-python-matplotlib-and-pandas/', duration: '5h', completed: false },
            { id: 'c5', title: 'SQL for Data Analysis', description: 'Window functions, CTEs, and advanced query patterns for extracting insights from relational databases.', link: 'https://www.udemy.com/course/advanced-sql-for-data-science/', duration: '5h', completed: false },
            { id: 'c6', title: 'Deep Learning with TensorFlow', description: 'Neural networks, CNNs, RNNs, and transfer learning using TensorFlow and Keras for real-world problems.', link: 'https://www.udemy.com/course/complete-guide-to-tensorflow-for-deep-learning-with-python/', duration: '8h', completed: false },
            { id: 'c7', title: 'ML Model Deployment with FastAPI', description: 'Packaging trained models, building prediction APIs with FastAPI, and deploying to cloud environments.', link: 'https://www.udemy.com/course/deployment-of-machine-learning-models/', duration: '5h', completed: false },
        ],
    },
];

const LEVEL_COLORS: Record<string, { color: string; bg: string }> = {
    Beginner:     { color: '#16A34A', bg: '#F0FDF4' },
    Intermediate: { color: '#D97706', bg: '#FFFBEB' },
    Advanced:     { color: '#2563EB', bg: '#EFF6FF' },
};

// ── Course Detail Modal ───────────────────────────────────────────────────────

const CourseDetailModal = ({
    journey,
    open,
    onClose,
}: {
    journey: Journey | null;
    open: boolean;
    onClose: () => void;
}) => {
    if (!journey) return null;
    const lc = LEVEL_COLORS[journey.level] ?? LEVEL_COLORS.Intermediate;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px', maxHeight: '88vh' } }}
        >
            {/* Header */}
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Chip
                                label={journey.track}
                                size="small"
                                sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#FFF1F2', color: BRAND_RED, borderRadius: '6px', letterSpacing: '0.4px', mb: 1 }}
                            />
                            <Typography variant="h5" fontWeight={800} sx={{ color: 'grey.900', lineHeight: 1.3 }}>
                                {journey.title}
                            </Typography>
                            <Typography sx={{ fontSize: 13.5, color: 'grey.600', mt: 0.8, lineHeight: 1.7 }}>
                                {journey.description}
                            </Typography>

                            {/* Meta */}
                            <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap' }}>
                                <Chip label={`${journey.courses} Courses`} size="small"
                                    sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                                <Chip label={journey.duration} size="small"
                                    sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                                <Chip label={journey.level} size="small"
                                    sx={{ fontSize: 12, fontWeight: 600, bgcolor: lc.bg, color: lc.color, borderRadius: '6px' }} />
                            </Box>
                        </Box>

                        <IconButton onClick={onClose} size="small" sx={{ mt: 0.5, color: 'grey.500' }}>
                            <CloseRounded />
                        </IconButton>
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey.500' }}>OVERALL PROGRESS</Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: BRAND_RED }}>{journey.progress}%</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={journey.progress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: '#F3F4F6',
                                '& .MuiLinearProgress-bar': { bgcolor: BRAND_RED, borderRadius: 3 },
                            }}
                        />
                        <Typography sx={{ fontSize: 12, color: 'grey.400', mt: 0.5 }}>
                            {journey.completedCourses} of {journey.courses} courses completed
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            {/* Course List */}
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'grey.800' }}>
                        Courses in this Journey
                    </Typography>
                </Box>

                <List disablePadding>
                    {journey.courseList.map((course, idx) => (
                        <Fragment key={course.id}>
                            {idx > 0 && <Divider sx={{ mx: 3 }} />}
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    px: 3,
                                    py: 2,
                                    '&:hover': { bgcolor: 'grey.50' },
                                    transition: 'background 0.15s',
                                }}
                            >
                                {/* Status icon */}
                                <Box sx={{ mr: 1.5, mt: 0.3, flexShrink: 0 }}>
                                    {course.completed
                                        ? <CheckCircleRounded sx={{ color: '#16A34A', fontSize: 20 }} />
                                        : <RadioButtonUncheckedRounded sx={{ color: 'grey.300', fontSize: 20 }} />
                                    }
                                </Box>

                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                    <Typography fontWeight={700} sx={{ fontSize: 14.5, color: 'grey.900' }}>
                                                        {course.title}
                                                    </Typography>
                                                    {course.completed && (
                                                        <Chip label="Completed" size="small"
                                                            sx={{ fontSize: 11, fontWeight: 600, bgcolor: '#F0FDF4', color: '#16A34A', borderRadius: '6px', height: 20 }} />
                                                    )}
                                                </Box>
                                                <Typography sx={{ fontSize: 13, color: 'grey.500', mt: 0.4, lineHeight: 1.6 }}>
                                                    {course.description}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                                    <Chip label={course.duration} size="small"
                                                        sx={{ fontSize: 11, bgcolor: '#F3F4F6', color: 'grey.600', borderRadius: '6px', height: 22 }} />
                                                    <Typography
                                                        component="a"
                                                        href={course.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{
                                                            fontSize: 12.5,
                                                            color: BRAND_RED,
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.3,
                                                            '&:hover': { textDecoration: 'underline' },
                                                        }}
                                                    >
                                                        Open Course
                                                        <OpenInNewRounded sx={{ fontSize: 13 }} />
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </Fragment>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

// ── Journey Card ──────────────────────────────────────────────────────────────

const JourneyCard = ({ journey, onClick, onProgressChange }: { journey: Journey; onClick: () => void; onProgressChange: (delta: number) => void }) => {
    const lc = LEVEL_COLORS[journey.level] ?? LEVEL_COLORS.Intermediate;
    return (
        <Box
            onClick={onClick}
            sx={{
                bgcolor: '#fff',
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: '14px',
                p: 3,
                mb: 2,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
                    borderColor: BRAND_RED,
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
                {/* Left — info */}
                <Box sx={{ flex: 1 }}>
                    <Chip
                        label={journey.track}
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#FFF1F2', color: BRAND_RED, borderRadius: '6px', letterSpacing: '0.4px', mb: 1.5 }}
                    />
                    <Typography variant="h5" fontWeight={800} sx={{ color: 'grey.900', mb: 1 }}>
                        {journey.title}
                    </Typography>
                    <Typography sx={{ fontSize: 13.5, color: 'grey.600', lineHeight: 1.7, maxWidth: 560 }}>
                        {journey.description}
                    </Typography>

                    {/* Meta chips */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                        <Chip label={`${journey.courses} Courses`} size="small"
                            sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                        <Chip label={journey.duration} size="small"
                            sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                        <Chip label={journey.level} size="small"
                            sx={{ fontSize: 12, fontWeight: 600, bgcolor: lc.bg, color: lc.color, borderRadius: '6px' }} />
                    </Box>
                </Box>

                {/* Right — progress */}
                <Box sx={{ minWidth: 180, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', mb: 0.5 }}>
                        CURRENT PROGRAM PROGRESS
                    </Typography>
                    <Typography sx={{ fontSize: 48, fontWeight: 900, color: BRAND_RED, lineHeight: 1 }}>
                        {journey.progress}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={journey.progress}
                        sx={{
                            mt: 1.5,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: '#F3F4F6',
                            '& .MuiLinearProgress-bar': { bgcolor: BRAND_RED, borderRadius: 3 },
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.8 }}>
                        <Tooltip title="Remove one course">
                            <span>
                                <IconButton size="small" disabled={journey.completedCourses === 0}
                                    onClick={() => onProgressChange(-1)}
                                    sx={{ p: 0.3, color: journey.completedCourses === 0 ? 'grey.300' : 'grey.500', '&:hover': { color: BRAND_RED } }}>
                                    <RemoveCircleRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Typography sx={{ fontSize: 12, color: 'grey.500' }}>
                            {journey.completedCourses} of {journey.courses} courses
                        </Typography>
                        <Tooltip title="Complete one more course">
                            <span>
                                <IconButton size="small" disabled={journey.completedCourses === journey.courses}
                                    onClick={() => onProgressChange(1)}
                                    sx={{ p: 0.3, color: journey.completedCourses === journey.courses ? 'grey.300' : BRAND_RED, '&:hover': { color: '#6e1424' } }}>
                                    <AddCircleRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const LearningJourneys = () => {
    const [journeys, setJourneys] = useState<Journey[]>(MOCK_JOURNEYS);

    const updateProgress = (id: string, delta: number) => {
        setJourneys(prev => prev.map(j => {
            if (j._id !== id) return j;
            const newCompleted = Math.min(j.courses, Math.max(0, j.completedCourses + delta));
            return { ...j, completedCourses: newCompleted, progress: Math.round((newCompleted / j.courses) * 100) };
        }));
    };
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);

    return (
        <Fragment>
            <TabTitle title="Learning Journeys" />
            <Box sx={{ width: '100%' }}>

                {/* Breadcrumb */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography sx={{ fontSize: 13, color: 'grey.500', cursor: 'pointer', '&:hover': { color: BRAND_RED } }}>
                        Learning Programs
                    </Typography>
                    <ChevronRightRounded sx={{ fontSize: 16, color: 'grey.400' }} />
                    <Typography sx={{ fontSize: 13, color: 'grey.800', fontWeight: 600 }}>Program Details</Typography>
                </Box>

                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ color: 'grey.900' }}>Learning Journeys</Typography>
                    <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>
                        Structured learning paths designed to build enterprise skills progressively.
                    </Typography>
                </Box>

                {/* Journey Cards */}
                {journeys.map(j => (
                    <JourneyCard key={j._id} journey={j}
                        onClick={() => setSelectedJourney(j)}
                        onProgressChange={(delta) => updateProgress(j._id, delta)}
                    />
                ))}
            </Box>

            <CourseDetailModal
                journey={selectedJourney}
                open={!!selectedJourney}
                onClose={() => setSelectedJourney(null)}
            />
        </Fragment>
    );
};

export default LearningJourneys;
