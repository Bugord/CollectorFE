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
                <span className="debtBlock__name">{this.props.name}
                        <img className="debtBlock__menuIcon" src={require('../../images/menuIcon.png')} alt="Add" />
                </span>

                <span className="debtBlock__friendName">{this.props.friendName}</span>
                <hr />
                <div>Description...</div>
                <br/>
                <div className="debtBlockDebt__value debt--red">123</div>
            </div>
        )
    }

    renderLast() {
        return (
            <div>
                <div className="addDebtBlock">
                    <img className="addDebtBlock__img" src={require('../../images/addIcon.png')} alt="Add" />
                </div>
            </div>
        )
    }
}

export default DebtBlock