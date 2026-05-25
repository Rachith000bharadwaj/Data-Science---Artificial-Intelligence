import './globals.css';

export const metadata = {
  title: 'KSRTC Route Optimization System',
  description: 'Karnataka State Road Transport Corporation - AI-Powered Route Optimization',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
