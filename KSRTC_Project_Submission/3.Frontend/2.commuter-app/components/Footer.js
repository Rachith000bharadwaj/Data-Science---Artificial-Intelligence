export default function Footer() {
  return (
    <footer className="py-12 text-white bg-gray-900">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">🚌 KSRTC</h3>
            <p className="text-gray-400">Your trusted bus booking partner</p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Contact</h4>
            <p className="text-gray-400">📞 1800-KSRTC-111</p>
            <p className="text-gray-400">✉️ support@ksrtc.in</p>
          </div>
        </div>
        <div className="pt-8 text-center text-gray-400 border-t border-gray-700">
          <p>&copy; 2025 KSRTC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
