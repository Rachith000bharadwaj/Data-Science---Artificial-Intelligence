import './globals.css'

export const metadata = {
  title: 'KSRTC - Bus Booking',
  description: 'Book your KSRTC bus tickets online',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
