/** @jsx React.DOM */
console.log(moment());
var Participant = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var amountString = (this.props.amount > 0) ? "For" : "Against";
    return (
      <div className="particpant">
        <p className="amount">User: {this.props.user.username} bets {Math.abs(this.props.amount)} {amountString}</p>
      </div>
    )
  }
})
var ParticipantList = React.createClass({
  getInitialState: function(){
    return {data: []};
  },
  render: function(){
    var participantNodes = this.props.data.map(function(participant, index) {
        return (
          <Participant amount={participant.amount} user={participant.user} key={index} />
        );
      });
    return (
      <div className="participant-list">
        {participantNodes}
      </div>
    );
  }
});


var Bet = React.createClass({ 
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var now = moment();
    var formattedText = moment(this.props.expires).format('ddd h:mmA');
    return (
      <div className="bet">
        <h3 className="betTitle">
          {this.props.title}
        </h3>
        <p className="muted">
          {formattedText}
        </p>
        <ParticipantList data={this.props.participants}>
        </ParticipantList>
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

      }.bind(this)
    });
  },
  handleBetSubmit: function(bet) {
    var bets = this.state.data;
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
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {

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
      <div className="bet-container">
        <BetForm onBetSubmit={this.handleBetSubmit} />
        <BetList data={this.state.data}/>
      </div>
    );
  }
});

var BetList = React.createClass({
  render: function() {
    var betNodes = this.props.data.map(function(bet, index) {
      return (
        <Bet title={bet.title} key={index} expires={bet.expires} participants={bet.participants} />
      );
    });
    return (
      <div className="bet-list col-md-6">
        <h2>Bet List </h2>
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
    var expires = React.findDOMNode(this.refs.expires).value.trim();
    if (!title || !amount || !expires) {
      return;
    }
    this.props.onBetSubmit({amount: amount, title: title, expires: expires});
    React.findDOMNode(this.refs.amount).value = '';
    React.findDOMNode(this.refs.title).value = '';
    React.findDOMNode(this.refs.expires).value = '';

  },
  render: function() {


    return (
      <form className="betForm form-signin col-md-3" onSubmit={this.handleSubmit}>
        <h3>Submit Bet</h3>
        <input type="text" placeholder="condition" ref="title" className="form-control"/>
        <input type="num" placeholder="amount" ref="amount" className="form-control" />
        <input type="date" placeholder="expires" ref="expires" className="form-control" />
        <button type="submit" className="btn btn-lg btn-primary btn-block">Place Bet</button>
      </form>
    );
  }
});

React.render(
  <BetContainer url="api/bets" pollInterval={1200} />,
  document.getElementById('bets')
);