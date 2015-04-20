/** @jsx React.DOM */
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
    console.log(this.props);
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

    return (
      React.createElement("div", {className: "bet"}, 
        React.createElement("h3", {className: "betTitle"}, 
          this.props.title
        ), 
        React.createElement("p", {className: "muted"}, 
          this.props.expires
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
      React.createElement("div", {className: "bet-container col-md-12"}, 
        React.createElement("h1", null, "Bets"), 
        React.createElement(BetForm, {onBetSubmit: this.handleBetSubmit, className: "col-md-3"}), 
        React.createElement(BetList, {data: this.state.data, className: "col-md-8"})
      )
    );
  }
});

var BetList = React.createClass({displayName: "BetList",
  render: function() {
    var betNodes = this.props.data.map(function(bet, index) {
      return (
        React.createElement(Bet, {title: bet.title, key: index, participants: bet.participants})
      );
    });
    return (
      React.createElement("div", {className: "bet-list"}, 
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
    if (!title || !amount) {
      return;
    }
    this.props.onBetSubmit({amount: amount, title: title});
    React.findDOMNode(this.refs.amount).value = '';
    React.findDOMNode(this.refs.title).value = '';
  },
  render: function() {


    return (
      React.createElement("form", {className: "betForm form-signin", onSubmit: this.handleSubmit}, 
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