const state = {
    exportList: []
}
const mutations = {
    ADDEXPORTLIST: (state, exportInfo) => {
        state.exportList.push(exportInfo);
    },
    DELEXPORTLIST: (state, id) => {
        state.exportList.map((item, index) => {
            if (item.id == id) {
                state.exportList.splice(index, 1);
            }
        });
    }
}

const actions = {
    commitAddAction({ commit }, exportInfo) {
        commit('ADDEXPORTLIST', exportInfo);
    },
    commitDelAction({commit},id){
        commit('DELEXPORTLIST',id);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}