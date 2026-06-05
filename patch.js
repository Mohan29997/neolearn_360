const fs = require('fs');
let code = fs.readFileSync('src/screens/app/admindashboard/index.tsx', 'utf8');

code = code.replace(
  "import {",
  "import { useTheme, alpha } from '@mui/material/styles';\nimport {"
);

code = code.replace(
  "const AdminDashboard = () => {",
  "const AdminDashboard = () => {\n  const theme = useTheme();"
);

// Map colors
code = code.replace(/'#FAFAFA'/g, 'theme.palette.background.default');
code = code.replace(/'#1A1A1A'/g, 'theme.palette.text.primary');
code = code.replace(/'#6B7280'/g, 'theme.palette.grey[500]');
code = code.replace(/'#900C3F'/g, 'theme.palette.error.main');
code = code.replace(/'#7A0935'/g, 'theme.palette.error.dark');
code = code.replace(/'#E5E7EB'/g, 'theme.palette.grey[200]');
code = code.replace(/'#F3F4F6'/g, 'theme.palette.grey[100]');
code = code.replace(/'#10B981'/g, 'theme.palette.success.main');
code = code.replace(/'#EF4444'/g, 'theme.palette.error.main');

code = code.replace(/'#FECDD3'/g, 'alpha(theme.palette.error.main, 0.2)');
code = code.replace(/'#FFF1F2'/g, 'alpha(theme.palette.error.main, 0.05)');
code = code.replace(/'#FFE4E6'/g, 'alpha(theme.palette.error.main, 0.1)');

code = code.replace(/'#D1D5DB'/g, 'theme.palette.grey[300]');
code = code.replace(/'#374151'/g, 'theme.palette.grey[700]');
code = code.replace(/'#F9FAFB'/g, 'theme.palette.grey[50]');

code = code.replace(/'#D97786'/g, 'theme.palette.error.light');

code = code.replace(/'#FEE2E2'/g, "alpha(theme.palette.warning.main, 0.1)");
code = code.replace(/'#991B1B'/g, 'theme.palette.warning.dark');
code = code.replace(/'#FCE7F3'/g, "alpha(theme.palette.error.main, 0.1)");

code = code.replace(/'#D1FAE5'/g, "alpha(theme.palette.success.main, 0.1)");
code = code.replace(/'#065F46'/g, 'theme.palette.success.dark');
code = code.replace(/'#FEF3C7'/g, "alpha(theme.palette.warning.main, 0.1)");
code = code.replace(/'#92400E'/g, 'theme.palette.warning.dark');
code = code.replace(/"#E5E7EB"/g, 'theme.palette.grey[200]');
code = code.replace(/"#900C3F"/g, 'theme.palette.error.main');

fs.writeFileSync('src/screens/app/admindashboard/index.tsx', code);
console.log("Patched successfully");
