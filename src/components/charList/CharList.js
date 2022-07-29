import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
  state = {
    charList: [],
    loading: true, 
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError)
  }

  onCharsLoaded = (char) => {
    this.setState({
      char,
      loading: false,
      onCharListLoading: false
    })
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true
    })
  }

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true
    });
  }

  onCharListLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({charList, offset}) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended
    }))
  }

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  }

  focusOnItem = (id) => {
    this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
    this.itemRefs[id].classList.add('char__item_selected');
    this.itemRefs[id].focus();
  }

  render() {
    const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
    const spinner = loading ? <Spinner/> : null;

    const cards = charList.map((item, i) => {
      return (
        <li className="char__item"
          key={item.id}
          onClick={() => {this.props.onCharSelected(item.id); this.focusOnItem(i);}}
          tabIndex={0}
          ref={this.setRef}
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === "Enter") {
              this.props.onCharSelected(item.id);
              this.focusOnItem(i);
            }}}>
          <img className={(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ?
            'char__img--not-found' :
            'char__img'} 
            src={item.thumbnail} alt="#"/>
          <div className="char__name">{item.name}</div>
        </li>
      )
    });
    
    return (
      <div className="char__list">
        <ul className="char__grid">
          {error}
          {spinner}
          {cards}
        </ul>
        <button 
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{'display': charEnded ? 'none' : 'block'}}
          onClick={() => this.onRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func
};

export default CharList;