import React, { Component } from 'react';

class DebtBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="debtBlock">
                {
                    !this.props.isLast ?
                        this.renderRegular()
                        :
                        this.renderLast()
                }
            </div>
        )
    }

    renderRegular() {
        return (
            <div>
                <span className="debtBlockName">{this.props.name}</span>
                <span className="debtBlockFriendName">{this.props.friendName}</span>
                <hr />
                <div>Description...</div>
                <div className="debtBlockDebtValue debtPositive"></div>
            </div>
        )
    }

    renderLast() {
        return (
            <div>
                <div className="addDebtBlock">
                    <img src={require('../../images/addIcon.png')} alt="Add" />
                </div>
            </div>
        )
    }
}

export default DebtBlock