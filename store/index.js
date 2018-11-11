import decodeToken from "jwt-decode"
import createPersistedState from 'vuex-persistedstate'
import Vuex from 'vuex'

const createStore = () => {
	return new Vuex.Store({
		state: {
			token: null,
			user: {}
		},
		mutations: {
			updateAuth(state, token) {
				try {
					state.user = decodeToken(token).user;
					state.token = token;
				} catch (e) {}
			},
			logout(state) {
				state.user = {};
				state.token = null;
			}
		},
		getters: {
			user(state) {
				return state.user;
			}
		},
		plugins: [createPersistedState()]
	})
}

export default createStore