import React, { Component } from 'react';
import '../styles/style.css';

class Emails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: [],
      malware: null,
      detectedMalware: []
    };
  }

  componentDidMount() {
     fetch('http://localhost:4000/malware')
      .then(res => res.json())
      .then(json => this.setState({ malware: json.malware }));
  }

  render() {
    return (
      <div>
        <div className="welcome">
          <h1>Malware Finder</h1>
          <button
            className="btn btn-success" onClick={this.getEmails}>
            Retrieve Emails
          </button>
          <hr/>
        </div>

        <div>
          <h2>Emails Recieved:</h2>

          <table>
            <tbody>
              <th>Date</th>
              <th>Sender</th>
              <th>Subject</th>
              <th>Attachments</th>

            {this.state.emails.map(( listValue, index ) => {
              return (
                <React.Fragment>
                  <tr className={this.getClass(listValue.attachments)} key={index}>
                    <td>{listValue.date}</td>
                    <td>{listValue.sender}</td>
                    <td>{listValue.subject}</td>
                    <td>{listValue.attachments.join(', ')}</td>
                </tr>
                </React.Fragment>
              )
            })}
            </tbody>
          </table>
        </div>
        <div className="detectedMalware">
          <h2>Detected Malware:</h2>
          <div className="actualMalware">
            <ul>
              {this.state.detectedMalware}
            </ul>
          </div>
        </div>
        <div className="emailBlacklist">
          <h2>Email Blacklist:</h2>
          <div className="blacklistedEmails">
            <ul>
              {this.state.detectedMalware}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  getEmails = () => {
    var ws = new WebSocket("ws://localhost:4001");

    ws.onopen = function() {
      alert("WebSocket connection has been opened.")
    }

    ws.onmessage = function (evt) {
      var data = JSON.parse(evt.data);
      var joined = this.state.emails.concat(data);
      this.setState({ emails: joined})
    }.bind(this);
  }

  getClass(attachment) {
    if (attachment.length > 0) {
      for(let i = 0; i < attachment.length; i++){
        if(this.state.malware.find(o => o.file === attachment[i])) {
          return "bad";
        } else {
          return "good";
        }
      }
    } else {
      return "good";
    }
  }
}

export default Emails;