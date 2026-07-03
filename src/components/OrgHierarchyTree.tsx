import { Avatar, Box, Modal, IconButton, Typography, CircularProgress, Button, Chip } from '@mui/material';
import {
  AccountTreeRounded, CloseRounded,
  EmailRounded, TuneRounded, PictureAsPdfRounded,
  GroupsRounded, CorporateFareRounded, HubRounded, TrendingUpRounded,
} from '@mui/icons-material';
import { BRAND, SURFACE } from '../constants/brand.constants';

// ── types ──────────────────────────────────────────────────────────────────
export type OrgNode = {
  _id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  department?: string;
  children?: OrgNode[];
  [key: string]: unknown;
};

export function normaliseNode(raw: unknown): OrgNode | null {
  if (!raw || typeof raw !== 'object') return null;
  const n = raw as Record<string, unknown>;
  if (!n.children) {
    n.children = (n.reports ?? n.subordinates ?? n.users ?? []) as OrgNode[];
  }
  return n as OrgNode;
}

export function getChildren(node: OrgNode): OrgNode[] {
  const kids = node.children ?? [];
  return Array.isArray(kids) ? (kids as OrgNode[]) : [];
}

// ── layout constants ───────────────────────────────────────────────────────
const ROOT_W  = 300;   // root card width
const CARD_W  = 240;   // child card width
const H_GAP   = 40;    // horizontal gap between sibling columns
const V_LINE  = 28;    // vertical connector height
const DOT_R   = 6;     // dot radius on connectors
const LINE_C  = BRAND.red;

function subtreeWidth(node: OrgNode, isRoot = false): number {
  const kids = getChildren(node);
  const cw   = isRoot ? ROOT_W : CARD_W;
  if (kids.length === 0) return cw;
  const total = kids.reduce((s, k) => s + subtreeWidth(k), 0) + (kids.length - 1) * H_GAP;
  return Math.max(cw, total);
}

// ── depth-based badge label ────────────────────────────────────────────────
const DEPTH_LABELS: Record<number, string> = {
  0: 'LEADERSHIP',
  1: 'MANAGEMENT',
  2: 'TEAM LEAD',
  3: 'MEMBER',
};

// ── node card ─────────────────────────────────────────────────────────────
function NodeCard({ node, depth }: { node: OrgNode; depth: number }) {
  const isRoot   = depth === 0;
  const cardW    = isRoot ? ROOT_W : CARD_W;
  const avSize   = isRoot ? 80 : 52;
  const avFs     = isRoot ? 28 : 18;
  const nameFs   = isRoot ? 17 : 14;
  const badge    = DEPTH_LABELS[depth] ?? 'MEMBER';

  const initials = (node.name ?? '')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Box sx={{
      width: cardW, bgcolor: '#fff',
      border: `1.5px solid ${isRoot ? BRAND.redBorder : SURFACE.border}`,
      borderRadius: '16px',
      boxShadow: isRoot
        ? '0 8px 32px rgba(139,26,46,0.13)'
        : '0 2px 12px rgba(0,0,0,0.07)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      pt: isRoot ? 3 : 2.5, pb: 2.5, px: 2.5,
      position: 'relative', flexShrink: 0,
    }}>
      {/* badge */}
      <Chip label={badge} size="small" sx={{
        position: 'absolute', top: -13,
        fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
        bgcolor: BRAND.red, color: '#fff', borderRadius: '6px',
        height: 22, px: 0.5,
      }} />

      {/* avatar */}
      <Avatar sx={{
        width: avSize, height: avSize, fontSize: avFs, fontWeight: 800,
        bgcolor: isRoot ? BRAND.red : BRAND.redBg,
        color: isRoot ? '#fff' : BRAND.red,
        mb: 1.5,
        boxShadow: isRoot ? '0 4px 16px rgba(139,26,46,0.25)' : 'none',
      }}>
        {initials}
      </Avatar>

      {/* name */}
      <Typography sx={{
        fontWeight: 700, fontSize: nameFs, color: BRAND.red,
        textAlign: 'center', lineHeight: 1.3, wordBreak: 'break-word',
      }}>
        {node.name}
      </Typography>

      {/* role */}
      <Typography sx={{
        fontSize: 12, color: 'grey.500', textAlign: 'center', mt: 0.4, fontWeight: 500,
      }}>
        {node.role}
      </Typography>

      {/* divider */}
      <Box sx={{ width: '80%', height: '1px', bgcolor: SURFACE.border, my: 1.5 }} />

      {/* email */}
      {node.email && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: '100%', mb: 0.6 }}>
          <EmailRounded sx={{ fontSize: 13, color: 'grey.400', flexShrink: 0 }} />
          <Typography sx={{
            fontSize: 11.5, color: 'grey.600',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {node.email}
          </Typography>
        </Box>
      )}

      {/* department as phone-row substitute when no phone */}
      {node.department && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: '100%' }}>
          <CorporateFareRounded sx={{ fontSize: 13, color: 'grey.400', flexShrink: 0 }} />
          <Typography sx={{ fontSize: 11.5, color: 'grey.600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.department}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ── connector dots ─────────────────────────────────────────────────────────
function Dot() {
  return (
    <Box sx={{
      width: DOT_R * 2, height: DOT_R * 2, borderRadius: '50%',
      bgcolor: BRAND.red, flexShrink: 0,
    }} />
  );
}

// ── recursive tree node ────────────────────────────────────────────────────
function OrgTreeNode({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const kids     = getChildren(node);
  const colW     = subtreeWidth(node, depth === 0);

  return (
    <Box sx={{ width: colW, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <NodeCard node={node} depth={depth} />

      {kids.length > 0 && (
        <>
          {/* vertical drop from card to rail */}
          <Box sx={{ width: 2, height: V_LINE, bgcolor: LINE_C, flexShrink: 0 }} />

          {/* horizontal rail with dots */}
          {kids.length > 1 && (() => {
            const firstW = subtreeWidth(kids[0]);
            const lastW  = subtreeWidth(kids[kids.length - 1]);
            return (
              <Box sx={{ position: 'relative', width: colW, height: DOT_R * 2, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {/* line */}
                <Box sx={{
                  position: 'absolute',
                  left:  firstW / 2,
                  right: lastW  / 2,
                  height: 2, bgcolor: LINE_C, top: '50%', transform: 'translateY(-50%)',
                }} />
                {/* left dot */}
                <Box sx={{ position: 'absolute', left: firstW / 2 - DOT_R, top: '50%', transform: 'translateY(-50%)' }}>
                  <Dot />
                </Box>
                {/* center dot (over parent line) */}
                <Box sx={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', top: '50%' }}>
                  <Dot />
                </Box>
                {/* right dot */}
                <Box sx={{ position: 'absolute', right: lastW / 2 - DOT_R, top: '50%', transform: 'translateY(-50%)' }}>
                  <Dot />
                </Box>
              </Box>
            );
          })()}

          {/* children row */}
          <Box sx={{ display: 'flex', gap: `${H_GAP}px`, flexShrink: 0, alignItems: 'flex-start' }}>
            {kids.map(child => (
              <Box key={String(child._id)} sx={{
                width: subtreeWidth(child),
                display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
              }}>
                <Box sx={{ width: 2, height: V_LINE, bgcolor: LINE_C, flexShrink: 0 }} />
                <OrgTreeNode node={child} depth={depth + 1} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

// ── stats footer ───────────────────────────────────────────────────────────
function countNodes(node: OrgNode): number {
  return 1 + getChildren(node).reduce((s, c) => s + countNodes(c), 0);
}
function maxDepth(node: OrgNode, d = 0): number {
  const kids = getChildren(node);
  if (!kids.length) return d;
  return Math.max(...kids.map(k => maxDepth(k, d + 1)));
}
function avgSpan(node: OrgNode): number {
  const kids = getChildren(node);
  if (!kids.length) return 0;
  const childSpans = kids.map(k => avgSpan(k)).filter(s => s > 0);
  const self = kids.length;
  if (!childSpans.length) return self;
  return (self + childSpans.reduce((a, b) => a + b, 0)) / (1 + childSpans.length);
}

function StatCard({ icon, label, value, sub, color = 'grey.800' }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <Box sx={{
      flex: 1, minWidth: 140,
      border: `1.5px solid ${SURFACE.border}`, borderRadius: '14px',
      p: 2.5, bgcolor: '#fff',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: BRAND.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'grey.500', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
        {sub && <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#16A34A' }}>{sub}</Typography>}
      </Box>
      <Box sx={{ mt: 1.5, height: 3, bgcolor: BRAND.redBg, borderRadius: 2 }}>
        <Box sx={{ width: '60%', height: '100%', bgcolor: BRAND.red, borderRadius: 2 }} />
      </Box>
    </Box>
  );
}

// ── public modal ───────────────────────────────────────────────────────────
interface HierarchyModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string;
  tree: OrgNode | null;
  onRetry: () => void;
}

export function HierarchyModal({ open, onClose, loading, error, tree, onRetry }: HierarchyModalProps) {
  const total  = tree ? countNodes(tree) : 0;
  const tiers  = tree ? maxDepth(tree) + 1 : 0;
  const span   = tree ? avgSpan(tree).toFixed(1) : '—';

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '96vw', maxWidth: 1320, height: '92vh',
        bgcolor: '#F5F6FA', borderRadius: '20px',
        display: 'flex', flexDirection: 'column',
        outline: 'none', boxShadow: '0 40px 120px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}>

        {/* ── header ── */}
        <Box sx={{
          px: 4, py: 2.5, bgcolor: '#fff',
          borderBottom: `1px solid ${SURFACE.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: 'grey.900' }}>
              Organization Hierarchy
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'grey.500', mt: 0.3 }}>
              Visual map of Enterprise structure and reporting lines.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button variant="outlined" startIcon={<TuneRounded sx={{ fontSize: 15 }} />} size="small"
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: 13, borderRadius: '10px', borderColor: SURFACE.border, color: 'grey.700', px: 2 }}>
              View Options
            </Button>
            <Button variant="contained" startIcon={<PictureAsPdfRounded sx={{ fontSize: 15 }} />} size="small"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: 13, borderRadius: '10px', bgcolor: BRAND.red, px: 2.5, boxShadow: 'none', '&:hover': { bgcolor: BRAND.redDark } }}>
              Export PDF
            </Button>
            <IconButton size="small" onClick={onClose} sx={{ ml: 0.5, color: 'grey.500' }}>
              <CloseRounded />
            </IconButton>
          </Box>
        </Box>

        {/* ── tree scroll area ── */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 5, pt: 5, pb: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress sx={{ color: BRAND.red }} />
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 2 }}>
              <Typography sx={{ color: 'error.main', fontSize: 14 }}>{error}</Typography>
              <Button variant="outlined" size="small" onClick={onRetry}
                sx={{ textTransform: 'none', fontWeight: 600, borderColor: BRAND.red, color: BRAND.red }}>
                Retry
              </Button>
            </Box>
          ) : tree ? (
            <Box sx={{ display: 'table', mx: 'auto' }}>
              <OrgTreeNode node={tree} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ color: 'grey.400', fontSize: 14 }}>No hierarchy data available.</Typography>
            </Box>
          )}
        </Box>

        {/* ── stats footer ── */}
        {tree && (
          <Box sx={{
            px: 4, py: 2.5,
            borderTop: `1px solid ${SURFACE.border}`,
            bgcolor: '#fff', flexShrink: 0,
            display: 'flex', gap: 2,
          }}>
            <StatCard
              icon={<GroupsRounded sx={{ fontSize: 17, color: BRAND.red }} />}
              label="Total Workforce"
              value={total.toLocaleString()}
              sub="+12%"
            />
            <StatCard
              icon={<CorporateFareRounded sx={{ fontSize: 17, color: BRAND.red }} />}
              label="Departments"
              value={tiers}
              sub="Active Units"
            />
            <StatCard
              icon={<HubRounded sx={{ fontSize: 17, color: BRAND.red }} />}
              label="Lead Span"
              value={span}
              sub="Avg Reports"
            />
            <StatCard
              icon={<TrendingUpRounded sx={{ fontSize: 17, color: BRAND.red }} />}
              label="Retention"
              value="94%"
              sub="Top Tier"
              color={BRAND.red}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
}
