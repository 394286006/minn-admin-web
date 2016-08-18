import alt from '../../../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.characters = [];
    this.messageResource={};
  }

}

export default alt.createStore(HomeStore);