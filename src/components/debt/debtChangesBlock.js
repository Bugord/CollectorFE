import React, { Component } from "react";
import DebtService from "../../debtService";
import { Collection, Button, Preloader, Row } from "react-materialize";
import DebtChange from "./debtChange";
import InfiniteScroll from "react-infinite-scroller";

export default class DebtChangesBlock extends Component {
  render() {
    var items = [];
    this.props.debtChanges.map((debtChange, index) =>
      items.push(<DebtChange key={index} debtChange={debtChange} />)
    );

    // return (
    //   <InfiniteScroll
    //     pageStart={0}
    //     loadMore={() => {
    //       this.props.debtChangesStartLoad();
    //       DebtService.getDebtChanges(
    //         this.props.debtId,
    //         this.props.debtChanges.length,
    //         20
    //       );
    //     }}
    //     hasMore={this.props.hasMore}
    //     loader={
    //       <div className="center-align">
    //         <Preloader size="big" color="green" />
    //       </div>
    //     }
    //   >
    //     <Collection>{items}</Collection>
    //   </InfiniteScroll>
    // );

    return (
      <div>
        {this.props.debtChanges.length ? (
          <Row>
            <Collection title="Changes">
              {this.props.debtChanges.map((change, index) => (
                <DebtChange key={index} debtChange={change} />
              ))}
            </Collection>
          </Row>
        ) : (
          <div className={this.props.changesLoading ? "hide" : null}>
            There are no changes yet.
          </div>
        )}
        {this.props.changesLoading ? (
          <div className="center-align">
            <Preloader size="big" color="green" />
          </div>
        ) : null}

        <div className="modal-footer overridden">
          <Button
            className="green lighten-2"
            onClick={() => {
              if (!this.props.hasMore) return;
              this.props.debtChangesStartLoad();
              DebtService.getDebtChanges(
                this.props.debtId,
                this.props.debtChanges.length,
                20
              );
            }}
          >
            Load more
          </Button>
        </div>
      </div>
    );
  }
}
