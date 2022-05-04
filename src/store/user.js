import { userService } from '../services';

const state = {
  all: {},
  currentWallet: {},
};

const actions = {
  getWallet({ commit }, { id, from, to }) {
    commit('getWalletRequest');

    userService.getWalletData({ id, from, to })
      .then(
        users => commit('getWalletSuccess', users),
        error => commit('getWalletFailure', error)
      );
  },

  delete({ commit }, id) {
    commit('deleteRequest', id);

    userService.delete(id)
      .then(
        user => commit('deleteSuccess', id),
        error => commit('deleteFailure', { id, error: error.toString() })
      );
  }
};

const mutations = {
  getWalletRequest(state) {
    state.all = { loading: true };
  },
  getWalletSuccess(state, registries) {
    console.log(registries);
    state.all = { items: registries };
    const data = [];
    const labels = [];
    if(registries && Array.isArray(registries) && registries.length > 0) {
      registries[0].wallet.assets.forEach(element => {
        labels.push(element.coin);
        data.push(element.value);
      });
      state.currentWallet = { data, labels };
    }
  },
  getWalletFailure(state, error) {
      state.all = { error };
  },
  deleteRequest(state, id) {
    state.all.items = state.all.items.map(user =>
      user.id === id
        ? { ...user, deleting: true }
        : user
    )
  },
  deleteSuccess(state, id) {
      state.all.items = state.all.items.filter(user => user.id !== id)
  },
  deleteFailure(state, { id, error }) {
    state.all.items = state.items.map(user => {
      if (user.id === id) {
        const { deleting, ...userCopy } = user;
        return { ...userCopy, deleteError: error };
      }

      return user;
    })
  }
};

export const users = {
    namespaced: true,
    state,
    actions,
    mutations
};