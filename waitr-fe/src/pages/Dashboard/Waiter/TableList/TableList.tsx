import styles from "./TableList.module.scss";
import { classNames } from "waitr-fe/src/helpers/className";
import { useDispatch, useSelector } from "react-redux";
import { waiterActions, WaiterState } from "../Waiter.slice";
import { RootState } from "waitr-fe/src/store";

type TableListProps = {};

const TableList = (props: TableListProps) => {
  const dispatch = useDispatch();
  const { selectedTable, tablesStatus } = useSelector(
    (state: RootState) => state.waiter as WaiterState
  );

  return (
    <>
      <div className={styles.tablesList}>
        {tablesStatus &&
          tablesStatus.map((table) => {
            const tableStyle =
              table.status === "ready"
                ? styles.ready
                : table.status === "preparing"
                  ? styles.preparing
                  : table.status === "delivered"
                    ? styles.delivered
                    : styles.payed;
            return (
              <div
                className={classNames(
                  styles.table,
                  tableStyle,
                  selectedTable === table.tableNumber
                    ? styles.selectedTable
                    : ""
                )}
                key={table.tableNumber}
                onClick={() => {
                  dispatch(waiterActions.setSelectedTable(table.tableNumber));
                  dispatch(waiterActions.setSelectedTableProductsToBePaid([]));
                }}
              >
                {table.tableNumber}
              </div>
            );
          })}
      </div>
      <div className={styles.filler}></div>
    </>
  );
};

export default TableList;
