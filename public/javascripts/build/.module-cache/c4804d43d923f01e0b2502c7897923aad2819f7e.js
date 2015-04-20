/** @jsx React.DOM */
console.log(moment());
var Participant = React.createClass({displayName: "Participant",
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var amountString = (this.props.amount > 0) ? "For" : "Against";
    return (
      React.createElement("div", {className: "particpant"}, 
        React.createElement("p", {className: "amount"}, "User: ", this.props.user.username, " bets ", Math.abs(this.props.amount), " ", amountString)
      )
    )
  }
})
var ParticipantList = React.createClass({displayName: "ParticipantList",
  getInitialState: function(){
    return {data: []};
  },
  render: function(){
    var participantNodes = this.props.data.map(function(participant, index) {
        return (
          React.createElement(Participant, {amount: participant.amount, user: participant.user, key: index})
        );
      });
    return (
      React.createElement("div", {className: "participant-list"}, 
        participantNodes
      )
    );
  }
});


var Bet = React.createClass({displayName: "Bet", 
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var now = moment();
    var formattedText = moment(this.props.expires).format('ddd h:mmA');
    return (
      React.createElement("div", {className: "bet"}, 
        React.createElement("h3", {className: "betTitle"}, 
          this.props.title
        ), 
        React.createElement("p", {className: "muted"}, 
          formattedText
        ), 
        React.createElement(ParticipantList, {data: this.props.participants}
        )
      )
    );
  }
});

var BetContainer = React.createClass({displayName: "BetContainer",
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
      React.createElement("div", {className: "bet-container"}, 
        React.createElement(BetForm, {onBetSubmit: this.handleBetSubmit}), 
        React.createElement(BetList, {data: this.state.data})
      )
    );
  }
});

var BetList = React.createClass({displayName: "BetList",
  render: function() {
    var betNodes = this.props.data.map(function(bet, index) {
      return (
        React.createElement(Bet, {title: bet.title, key: index, expires: bet.expires, participants: bet.participants})
      );
    });
    return (
      React.createElement("div", {className: "bet-list col-md-6"}, 
        React.createElement("h2", null, "Bet List "), 
        betNodes
      )
    );
  }
});

var BetForm = React.createClass({displayName: "BetForm",
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
      React.createElement("form", {className: "betForm form-signin col-md-3", onSubmit: this.handleSubmit}, 
        React.createElement("h3", null, "Submit Bet"), 
        React.createElement("input", {type: "text", placeholder: "condition", ref: "title", className: "form-control"}), 
        React.createElement("input", {type: "num", placeholder: "amount", ref: "amount", className: "form-control"}), 
        React.createElement("input", {type: "date", placeholder: "expires", ref: "expires", className: "form-control"}), 
        React.createElement("button", {type: "submit", className: "btn btn-lg btn-primary btn-block"}, "Place Bet")
      )
    );
  }
});

React.render(
  React.createElement(BetContainer, {url: "api/bets", pollInterval: 1200}),
  document.getElementById('bets')
);