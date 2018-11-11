<template>
	<div class="container">
		<div class="columns">
			<div class="column is-3">
				<aside class="menu">
					<p class="menu-label">Settings</p>
					<ul class="menu-list">
						<li>
							<router-link to="/settings">Profile</router-link>
							<ul>
								<li><router-link to="/settings/profile">General</router-link></li>
								<li><router-link to="/">Emails</router-link></li>
							</ul>
						</li>
						<li><router-link to="/">Scheduling</router-link></li>
						<li><router-link to="/">Assistant</router-link></li>
						<li><router-link to="/">Places and profiles</router-link></li>
						<li><router-link to="/">Templates</router-link></li>
					</ul>
					<p class="menu-label">Billing</p>
					<ul class="menu-list">
						<li><router-link to="/">Subscription</router-link></li>
						<li><router-link to="/">Invoices</router-link></li>
						<li><router-link to="/">Promotions</router-link></li>
					</ul>
				</aside>
			</div>
			<div class="column"><nuxt /></div>
		</div>
	</div>
</template>

<style>
.menu-list a.nuxt-link-exact-active {
	background-color: #3273dc;
	color: #fff;
}
</style>
