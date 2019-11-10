import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { User } from "../models/user";
import { Transaction } from "../models/transaction.interface";

@Injectable({ providedIn: "root" })
export class TransactionService {
  constructor(private http: HttpClient) {}

  public getTransactions() {
    return this.http.get<any>(`${environment.resourceApiUrl}/getTransactions`);
  }
}
