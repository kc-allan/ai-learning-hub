import { Layout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-betwen items-center gap-4">
          <div className="flex items-center gap-2">
            <Layout className="h-8 w-8 text-blue-500" />
            <a href="/" className="text-xl font-bold text-blue-500">
              AI Learning Hub
            </a>
          </div>
          <p className="text-gray-600">
            Empowering learners through intelligent, adaptive AI education.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Courses
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;