import './globals.css';

export const metadata = {
  title: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์ | Buriram PAO',
  description: 'เว็บไซต์ทางการขององค์การบริหารส่วนจังหวัดบุรีรัมย์ — บริการประชาชน ข่าวสาร กิจกรรม และข้อมูลการบริหารงาน',
  keywords: 'อบจ.บุรีรัมย์, องค์การบริหารส่วนจังหวัดบุรีรัมย์, Buriram PAO, บุรีรัมย์',
  openGraph: {
    title: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
    description: 'เว็บไซต์ทางการขององค์การบริหารส่วนจังหวัดบุรีรัมย์',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
