import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Transaction } from "../../shared/models/transaction.interface";
import { TransactionService } from "../../shared/services/transaction.service";
import { AuthService } from "../../shared/services/auth.service";
import { User } from "../../shared/models/user.interface";

@Component({
  selector: "app-mytransactions",
  templateUrl: "./mytransactions.component.html",
  styleUrls: ["./mytransactions.component.scss"]
})
export class MytransactionsComponent implements OnInit {
  myTransactions: Transaction[];
  constructor(private transactionService: TransactionService) {}
  ngOnInit() {
    this.transactionService.getTransactions().subscribe((data: any[]) => {
      this.myTransactions = data;
    });
  }
}
