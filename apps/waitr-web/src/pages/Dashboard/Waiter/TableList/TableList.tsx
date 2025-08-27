import styles from "./TableList.module.scss";
import { classNames } from "@helpers/className";
import { waiterActions } from "../Waiter.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "@helpers/app.hooks";

type TableListProps = {};

const TableList = (props: TableListProps) => {
  const dispatch = useAppDispatch();
  const { selectedTable, tablesStatus } = useAppSelector(
    (state) => state.waiter
  );

  return (
    <>
      <div className={styles.tablesList}>
        {tablesStatus &&
          tablesStatus.map((table) => {
            const tableStyle =
              table.status === "ready" || table.status === "billed"
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
