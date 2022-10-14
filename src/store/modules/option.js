const state = {
    option: []
};
const mutations = {
    SETOPTION: (state, option) => {
        state.option = option;
    }
};
const actions = {
    commitAction({ commit }, option) {
        commit('SETOPTION', option);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}