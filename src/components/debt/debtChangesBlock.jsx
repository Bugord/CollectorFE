import React from "react";
import DebtService from "./debtService";
import { Collection, Button, Preloader, Row } from "react-materialize";
import DebtChange from "./debtChange";

export default function DebtChangesBlock(props) {
  var items = [];
  props.debtChanges.map((debtChange, index) =>
    items.push(<DebtChange key={index} debtChange={debtChange} />)
  );

  return (
    <div>
      {props.debtChanges.length ? (
        <Row>
          <Collection title="Changes">
            {props.debtChanges.map((change, index) => (
              <DebtChange key={index} debtChange={change} />
            ))}
          </Collection>
        </Row>
      ) : (
        <div className={props.changesLoading ? "hide" : null}>
          There are no changes yet.
        </div>
      )}
      {props.changesLoading ? (
        <div className="center-align">
          <Preloader size="big" color="green" />
        </div>
      ) : null}

      <div className="modal-footer overridden">
        <Button
          className="green lighten-2"
          onClick={() => {
            if (!props.hasMore) return;
            props.debtChangesStartLoad();
            DebtService.getDebtChanges(
              props.debtId,
              props.debtChanges.length,
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
