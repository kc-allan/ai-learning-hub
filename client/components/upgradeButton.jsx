import { useCheckout } from "@stripe/react-stripe-js";

export function UpgradeButton() {
	const { mutate, isPending }= useCheckout({
	  mutation: {
		onSuccess: (data) => {
		  window.location.href = data.url;
		},
		onError: (error) => {
		  // handle error..
		},
	  },
	});
  
	function handleClick() {
	  mutate({ data: {} })
	}
  
	return (
	  <Button onClick={handleClick} disabled={isPending}>
		<CrownIcon className="w-4 h-4 mr-2" />
		Upgrade
	  </Button>
	)
  }