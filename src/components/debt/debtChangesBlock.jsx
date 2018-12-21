import React from "react";
import { getDebtChangesAPI } from "./debtService";
import { Collection, Button, Preloader, Row } from "react-materialize";
import DebtChange from "./debtChange";
import PropTypes from "prop-types"

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
            getDebtChangesAPI(
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

DebtChangesBlock.propTypes = {
  debtChanges: PropTypes.array,
  changesLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  debtId: PropTypes.number
};