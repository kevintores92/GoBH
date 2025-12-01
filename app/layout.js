import './globals.css'

export const metadata = {
  title: 'GOBH Investments - Your Trusted Property Acquisition Partner',
  description: 'We purchase homes in any condition, anywhere. Get your cash offer today!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}