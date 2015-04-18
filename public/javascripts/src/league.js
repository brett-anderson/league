var Bet = React.createClass({
  render: function() {
    return (
      <div className="bet">
        <h2 className="betAmount">
          {this.props.title}
        </h2>
        <p className="betTitle">
          {this.props.amount}
        </p>
      </div>
    );
  }
});

var BetContainer = React.createClass({
  loadBetsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleBetSubmit: function(bet) {
    var bets = this.state.data;
    bets.push(bet);
    this.setState({data: bets}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: bet,
        success: function(data) {
          console.log(data);
          // this.setState({data: bets});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadBetsFromServer();
    // setInterval(this.loadBetsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="betContainer">
        <h1>Bets</h1>
        <BetList data={this.state.data} />
        <BetForm onBetSubmit={this.handleBetSubmit} />
      </div>
    );
  }
});

var BetList = React.createClass({
  render: function() {
    console.log(this.props.data);
    var betNodes = this.props.data.map(function(bet, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Bet amount={bet.amount} title={bet.title} key={index}>
          {bet.title}
          {bet.amount}
        </Bet>
      );
    });
    return (
      <div className="betList">
        {betNodes}
      </div>
    );
  }
});

var BetForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var amount = React.findDOMNode(this.refs.amount).value.trim();
    var title = React.findDOMNode(this.refs.title).value.trim();
    if (!title || !amount) {
      return;
    }
    this.props.onBetSubmit({amount: amount, title: title});
    React.findDOMNode(this.refs.amount).value = '';
    React.findDOMNode(this.refs.title).value = '';
  },
  render: function() {
    return (
      <form className="betForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="title" ref="title" />
        <input type="num" placeholder="amount" ref="amount" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <BetContainer url="api/bets" pollInterval={1200} />,
  document.getElementById('bets')
);