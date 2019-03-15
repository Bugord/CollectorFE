import AuthService from "../auth/authService";
import { store } from "../../store";
import { paymentsGetAll } from "./statisticsActions";
import { showError } from "../common/helperFunctions";

export function paymentsGetAPI() {
  AuthService.get("api/getPayments")
    .then(res => store.dispatch(paymentsGetAll(res.data)))
    .catch(res => showError(AuthService.handleException(res)));
}
