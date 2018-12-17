import React from "react";
import Collapsible from "react-materialize";
import DebtChange from "./debtChange";
import Collection from "react-materialize/lib/Collection";

export const DebtChangesList = ({ debtChanges }) => (
    <Collapsible header="Debt changes">
      {debtChanges.map((debtChange) => (
      <DebtChange key={debtChange.id} debtChange={debtChange} />
    ))}
    </Collapsible>
);
