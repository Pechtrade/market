export const metadata = {
  title: 'Market True',
  description: 'Market True FULL – moderní přehled trhů',
}

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
