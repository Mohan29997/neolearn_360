// @mui
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import type { Theme } from '@mui/material/styles';
// ----------------------------------------------------------------------

export function GlobalStyles({ theme: { palette } }: { theme: Theme }) {

  const inputGlobalStyles = (
    <MUIGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
          margin: "0px",
          padding: "0px",
          // color: "#212B36"
        },
        "h1,h2,h3,h4,h5,h6,p": {
          color: "#212B36",
        },
        html: {
          margin: "0px",
          padding: "0px",
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: "smooth",
          "--tw-bg-opacity": 1,
          backgroundColor: palette?.background?.default,

          // backgroundImage: `url(${cyanBlur}), url(${redBlur})`,
          // backgroundRepeat: "no-repeat, no-repeat",
          // backgroundPosition: "right top, left bottom",
          // backgroundSize: "50%, 50%",
        },
        body: {
          margin: "0px",
          padding: "0px",
          width: '100%',
          height: 'auto',
          scrollBehavior: "smooth",
          "--tw-bg-opacity": 1,
        },
        '#root': {
          width: '100%',
          height: '100%',
          scrollBehavior: "smooth",
          "--tw-bg-opacity": 1,
        },
        "::selection": {
          background: palette?.success?.main,
          color: palette?.text?.secondary,
        },
        ".quill>.ql-container>.ql-editor.ql-blank::before": {
          fontSize: "14px",
          color: palette?.grey[700],
          fontWeight: 600,
          fontFamily: "Open Sans",
        },
        '&::-webkit-scrollbar': {
          // width: '14px',
          display: "none"
          // width: "22px"
        },
        "&::-webkit-scrollbar-thumb": {
          border: '4px solid rgba(0, 0, 0, 0)',
          // border: '8px solid rgba(0, 0, 0, 0)',
          backgroundClip: 'padding-box',
          backgroundColor: palette?.primary?.main, // lighter,
          borderRadius: 9999,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          border: '4px solid rgba(0, 0, 0, 0)',
          // border: '9px solid rgba(0, 0, 0, 0)',
          backgroundClip: 'padding-box',
          backgroundColor: palette?.primary?.light,
          borderRadius: 9999
        }
      }}
    />
  );

  return inputGlobalStyles;
}