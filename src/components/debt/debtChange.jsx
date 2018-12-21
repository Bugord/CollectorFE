import React from "react";
import { Collection } from "react-materialize";
import CollectionItem from "react-materialize/lib/CollectionItem";
import { convertUTCDateToLocalDate } from "../common/helperFunctions";
import Collapsible from "react-collapsible";
import PropTypes from "prop-types"

export default function DebtChange(props) {
  let { debtChange } = props;
  return (
    <CollectionItem className="no-padding">
      <Collapsible
        trigger={
          <div>
            {convertUTCDateToLocalDate(
              new Date(debtChange.changeTime)
            ).toLocaleString("ru-ru")}{" "}
            (
            {`${debtChange.fieldChanges.length} ${
              debtChange.fieldChanges.length > 1 ? "changes" : "change"
            }`}
            )
          </div>
        }
      >
        <Collection className="debt-changes">
          {debtChange.fieldChanges.map((fieldChange, index) => (
            <CollectionItem key={index}>
              <h5 className="title">{fieldChange.changedField}</h5>
              <p className="value old">{fieldChange.oldValue}</p>
              <p className="value new">{fieldChange.newValue}</p>
            </CollectionItem>
          ))}
        </Collection>
      </Collapsible>
    </CollectionItem>
  );
}

DebtChange.propTypes = {
  debtChange: PropTypes.object
};