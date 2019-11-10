import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Transaction } from "../../shared/models/transaction.interface";
import { TransactionService } from "../../shared/services/transaction.service";
import { AuthService } from "../../shared/services/auth.service";
import { User } from "../../shared/models/user";

@Component({
  selector: "app-mytransactions",
  templateUrl: "./mytransactions.component.html",
  styleUrls: ["./mytransactions.component.scss"]
})
export class MytransactionsComponent implements OnInit {
  myTransactions: Transaction[];
  currentUser: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;

    this.transactionService.getTransactions().subscribe((data: any[]) => {
      this.myTransactions = data;
    });
  }
}
