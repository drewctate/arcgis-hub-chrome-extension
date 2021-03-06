import { h, Component } from 'preact';
import Factory from '../../services';
import SiteListing from './site-listing/site-listing';
import Loader from '../loader/loader';

import './initiatives-list.scss';

const UP_KEY = 38;
const DOWN_KEY = 40;
const ENTER_KEY = 13;

class InitiativesList extends Component {

  constructor () {
    super();
    this.state = {
      searchStr: '',
      selectedSiteIndex: 0,
      resultsObj: null,
      isLoading: false
    };
    this.searchSiteItems = this.searchSiteItems.bind(this);
    this.onInput = this.onInput.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
  }

  componentDidMount() {
    this.searchField.focus();
    window.addEventListener('keydown', this.handleKeyEvent, false);
  }

  handleKeyEvent(ev) {
    const selectedSiteIndex = this.state.selectedSiteIndex;

    switch (ev.keyCode) {
      case UP_KEY:
        if (selectedSiteIndex > 0) {
          this.setState({selectedSiteIndex: selectedSiteIndex - 1})
        }
        break;
      case DOWN_KEY:
        if (selectedSiteIndex < this.state.resultsObj.results.length - 1) {
          this.setState({selectedSiteIndex: selectedSiteIndex + 1})
        }
        break;
      case ENTER_KEY:
        chrome.tabs.create({ url: this.state.resultsObj.results[selectedSiteIndex].url });
    }
  }

  searchSiteItems(query) {
    this.setState({isLoading: true});
    return Factory.itemService.searchSiteItems(query)
        .then(resultsObj =>
          this.setState({
            resultsObj,
            selectedSiteIndex: 0,
            isLoading: false
          }));
  }

  onInput(e) {
    const { value } = e.target;
    this.setState({searchStr: value});
    return this.searchSiteItems(value);
  }

  render(props, { searchStr, selectedSiteIndex, resultsObj, isLoading }) {
    return (
      <div>
        <h1>Hub Sites</h1>
        <input type='text' placeholder='Search'
          ref={input => this.searchField = input} value={searchStr} onInput={this.onInput}></input>
          {resultsObj && !isLoading &&
            <div class='scroll-box'>
                {resultsObj.results.map((item, i) =>
                  <SiteListing site={item} selected={i === selectedSiteIndex} />)}
            </div>
          }
          {isLoading && <Loader />}
      </div>
    );
  }
}

export default InitiativesList
