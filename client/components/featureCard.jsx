const FeatureCard = ({ icon, title, description }) => {
	return (
	  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all group">
		<div className="mb-4 text-blue-600 group-hover:text-blue-700 transition-colors">
		  {icon}
		</div>
		<h3 className="text-xl font-semibold mb-2">{title}</h3>
		<p className="text-gray-600">{description}</p>
	  </div>
	);
  };

  export default FeatureCard;