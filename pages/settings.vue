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
								<li><router-link to="/settings/emails">Your emails</router-link></li>
								<li><router-link to="/settings/password">Password &amp; security</router-link></li>
							</ul>
						</li>
						<li><router-link to="/settings/scheduling">Scheduling</router-link></li>
						<li><router-link to="/settings/assistant">Assistant</router-link></li>
						<li><router-link to="/settings/places">Places and profiles</router-link></li>
						<li><router-link to="/settings/templates">Templates</router-link></li>
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
