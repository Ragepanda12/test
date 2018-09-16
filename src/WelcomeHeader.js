import React, { Component } from 'react';
import style from './style';

class WelcomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { gardenid: '59e41a62387a641f4c38bf3a' };
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleTokenChange(e) {
    this.setState({ gardenid: e.target.value });
  }
  handleCreate(e) {
    e.preventDefault();
    this.setState({ gardenid: '' });
    this.props.onCreateClicked();
  }
  handleSubmit(e) {
    e.preventDefault();



    // let author = this.state.author.trim();
    // let text = this.state.text.trim();
    let token = this.state.gardenid.trim();
    if (!token) {
      return;
    }

    // this.props.onTileSubmit({ author: author, text: text });
    // this.setState({ author: '', text: '' });
    this.props.onTokenSubmit(token)
    this.setState({ gardenid: '' });

  }
  render() {
    return (
      <form style={ style.commentForm } onSubmit={ this.handleSubmit }>
        <button
          style={ style.commentFormPost }
          value='Create' 
          onClick={this.handleCreate} >Create</button>
        <input
          type='text'
          placeholder='Enter a garden token!'
          style={ style.commentFormText}
          value={ this.state.gardenid }
          onChange={ this.handleTokenChange } />
        <input
          type='submit'
          style={ style.commentFormPost }
          value='Submit' />
      </form>

    )
  }
}

export default WelcomeHeader;