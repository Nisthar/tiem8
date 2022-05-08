<script context="module">
	import { apiUrl } from '$lib/global';

	export async function load({ fetch }) {
		const req = await fetch(`${apiUrl}/products`);
		const res = await req.json();
		return {
			props: {
				products: res.products.data
			}
		};
	}
</script>

<script>
	import Carousel from '$lib/components/Home/Carousel.svelte';
	import Chat from '$lib/components/Home/Chat.svelte';
	import Navbar from '$lib/components/Home/Navbar.svelte';
	import Product from '$lib/components/Home/Product.svelte';
	import { onMount } from 'svelte';

	export let products;

	onMount(async () => {
		//create a script tag
		const script = document.createElement('script');
		//set the src attribute
		script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
		//add the script tag to the head
		document.body.appendChild(script);

		const req = await fetch(`${apiUrl}/welcome`);
		const res = await req.json();
		console.log(res);
		const dfWidget = document.getElementById('widgetIcon');
		if (dfWidget) {
			dfWidget.click();
		}
	});
</script>

<Navbar />
<!-- <Carousel /> -->

<section class="bg-white py-8">
	<div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
		{#each products as product}
			<Product {product} />
		{/each}
	</div>
</section>

<footer class="container mx-auto bg-white py-8 border-t border-gray-400">
	<div class="container flex px-3 py-8 ">
		<div class="w-full mx-auto flex flex-wrap">
			<div class="flex w-full lg:w-1/2 ">
				<div class="px-3 md:px-0">
					<h3 class="font-bold text-gray-900">About</h3>
					<p class="py-4">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mi ut felis tempus
						commodo nec id erat. Suspendisse consectetur dapibus velit ut lacinia.
					</p>
				</div>
			</div>
			<div class="flex w-full lg:w-1/2 lg:justify-end lg:text-right">
				<div class="px-3 md:px-0">
					<h3 class="font-bold text-gray-900">Social</h3>
					<ul class="list-reset items-center pt-3">
						<li>
							<a class="inline-block no-underline hover:text-black hover:underline py-1" href="#"
								>Add social links</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</footer>
<div class="w-1/3 bg-white z-50 " style="position: fixed; bottom:0; right:0;">
	<!-- <Chat /> -->
</div>
<df-messenger
	intent="WELCOME"
	chat-title="Online-Shopping"
	agent-id="6090d131-0b92-4413-8bee-5a0b9aa6f3e2"
	language-code="en"
/>
