import { CheckCircle } from "lucide-react";

const PricingCard = ({ title, price, features, featured = false }) => {
	return (
	  <div className={`border rounded-lg p-6 transform transition-all ${
		featured ? 'bg-red-400 text-white scale-105 shadow-2xl' : 'bg-white hover:shadow-xl'
	  }`}>
		<div className="flex justify-between items-center mb-4">
		  <h3 className="text-xl font-bold">{title}</h3>
		  {featured && (
			<span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs">
			  Most Popular
			</span>
		  )}
		</div>
		<div className="text-3xl font-extrabold mb-4">
		  ${price}
		  <span className="text-sm font-normal">/month</span>
		</div>
		<ul className="space-y-3 mb-6">
		  {features.map((feature, index) => (
			<li key={index} className="flex items-center">
			  <CheckCircle 
				className={`mr-2 ${featured ? 'text-white' : 'text-green-500'}`} 
				size={20} 
			  />
			  {feature}
			</li>
		  ))}
		</ul>
		<button className={`w-full py-3 rounded-lg transition-all ${
		  featured ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
		}`}>
		  Get Started
		</button>
	  </div>
	);
  };

  export default PricingCard;